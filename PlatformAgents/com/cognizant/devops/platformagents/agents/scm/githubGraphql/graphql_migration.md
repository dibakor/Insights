# GitHub Agent Migration: REST API to GraphQL

## Overview
This document outlines the strategy for migrating GitAgentV2.py from GitHub REST API v3 to GitHub GraphQL API v4. This migration will improve performance, reduce API calls, and future-proof the agent against REST API deprecation.

## Current REST API Calls

The agent currently makes the following REST API calls:

1. **Get Repositories** (Line 54)
   - Endpoint: `GET /users/{username}/repos`
   - Purpose: Fetch all repositories for a user
   - Pagination: Page-based (100 per page)

2. **Get Branches** (Line 81)
   - Endpoint: `GET /repos/{owner}/{repo}/branches`
   - Purpose: Fetch all branches for a repository
   - Pagination: Page-based (100 per page)

3. **Get Commits** (Line 146)
   - Endpoint: `GET /repos/{owner}/{repo}/commits`
   - Purpose: Fetch commits for a specific branch
   - Pagination: Page-based (100 per page)
   - Filters: `sha` (branch), `since` (date)

4. **Get Commit Details** (Line 196)
   - Endpoint: `GET /repos/{owner}/{repo}/commits/{sha}`
   - Purpose: Fetch file changes for a specific commit
   - No pagination (single commit)

5. **Get Pull Requests** (Line 256)
   - Endpoint: `GET /repos/{owner}/{repo}/pulls`
   - Purpose: Fetch pull requests for a branch
   - Pagination: Page-based (100 per page)
   - Filters: `head` (branch), `state=all`, `sort=updated`

## Migration Plan

### Phase 1: Setup & Infrastructure

**Objective**: Add GraphQL support while maintaining REST fallback

**Tasks**:
- Add GraphQL endpoint configuration: `https://api.github.com/graphql`
- Create `executeGraphQLQuery()` method for GraphQL requests
- Update authentication (GraphQL uses same token with `Bearer` prefix)
- Implement GraphQL-specific error handling
- Add rate limit checking for GraphQL (points-based system)
- Add configuration flag `useGraphQL` for enabling/disabling GraphQL

**Code Changes**:
```python
def executeGraphQLQuery(self, query, variables=None):
    """Execute a GraphQL query against GitHub API"""
    headers = {
        "Authorization": "Bearer " + self.accessToken,
        "Content-Type": "application/json"
    }
    payload = {"query": query}
    if variables:
        payload["variables"] = variables

    response = self.getResponse(
        self.graphqlEndpoint,
        'POST',
        None,
        None,
        json.dumps(payload),
        reqHeaders=headers
    )

    if "errors" in response:
        self.baseLogger.error(f"GraphQL errors: {response['errors']}")
        raise Exception(f"GraphQL query failed: {response['errors']}")

    return response.get("data", {})
```

### Phase 2: Query Design

**Objective**: Design GraphQL queries to replace each REST endpoint

#### 2.1 Repositories Query

**GraphQL Query**:
```graphql
query GetRepositories($login: String!, $cursor: String) {
  user(login: $login) {
    repositories(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: ASC}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        defaultBranchRef {
          name
        }
      }
    }
  }
}
```

**Benefits**:
- Fetch only needed fields (name, default branch)
- Cursor-based pagination (more reliable)
- Single query structure

#### 2.2 Branches Query

**GraphQL Query**:
```graphql
query GetBranches($owner: String!, $repo: String!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    refs(refPrefix: "refs/heads/", first: 100, after: $cursor) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        name
        target {
          ... on Commit {
            oid
          }
        }
      }
    }
  }
}
```

**Benefits**:
- Direct access to commit SHA
- No need for separate commit lookup
- More efficient than REST

#### 2.3 Commits Query (with File Details)

**GraphQL Query**:
```graphql
query GetCommits($owner: String!, $repo: String!, $branch: String!, $since: GitTimestamp, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    ref(qualifiedName: $branch) {
      target {
        ... on Commit {
          history(first: 100, after: $cursor, since: $since) {
            pageInfo {
              hasNextPage
              endCursor
            }
            nodes {
              oid
              message
              committedDate
              author {
                name
                date
              }
              additions
              deletions
              changedFiles
              parents {
                totalCount
              }
            }
          }
        }
      }
    }
  }
}
```

**Benefits**:
- Combines commit list + basic file stats in one query
- No need for separate commit details call
- Reduces API calls by ~50% for commits

#### 2.4 Commit File Details Query

**GraphQL Query**:
```graphql
query GetCommitFiles($owner: String!, $repo: String!, $commitSha: String!) {
  repository(owner: $owner, name: $repo) {
    object(oid: $commitSha) {
      ... on Commit {
        oid
        message
        committedDate
        author {
          name
        }
        parents {
          totalCount
        }
        additions
        deletions
        changedFiles
      }
    }
  }
}
```

**Note**: GraphQL doesn't provide per-file change details directly. We may need to:
- Use REST API fallback for detailed file changes
- Or use Git tree comparison in GraphQL (more complex)
- Or accept aggregate statistics only

#### 2.5 Pull Requests Query

**GraphQL Query**:
```graphql
query GetPullRequests($owner: String!, $repo: String!, $headRefName: String!, $cursor: String) {
  repository(owner: $owner, name: $repo) {
    pullRequests(first: 100, after: $cursor, headRefName: $headRefName, orderBy: {field: UPDATED_AT, direction: DESC}) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        number
        state
        createdAt
        updatedAt
        closedAt
        mergedAt
        headRefName
        headRefOid
        baseRefName
        baseRefOid
        mergeCommit {
          oid
        }
        isCrossRepository
        author {
          login
        }
        commits {
          totalCount
        }
        changedFiles
        headRepository {
          isFork
        }
      }
    }
  }
}
```

**Benefits**:
- All PR data in single query
- Includes commit counts and file changes
- More efficient filtering

### Phase 3: Pagination Strategy

**Objective**: Replace page-based pagination with cursor-based pagination

**Current (REST)**:
```python
pageNum = 1
while fetchNextPage:
    data = getResponse(url + f'?per_page=100&page={pageNum}')
    pageNum += 1
```

**New (GraphQL)**:
```python
cursor = None
while True:
    result = executeGraphQLQuery(query, {"cursor": cursor})
    nodes = result['repository']['refs']['nodes']
    pageInfo = result['repository']['refs']['pageInfo']

    # Process nodes...

    if not pageInfo['hasNextPage']:
        break
    cursor = pageInfo['endCursor']
```

**Benefits**:
- More reliable (handles data changes during pagination)
- Consistent with GraphQL best practices
- Better performance

### Phase 4: Response Parsing

**Objective**: Update parsing logic for GraphQL nested responses

**Changes Required**:
- Update field mappings in `parseResponse()`
- Handle GraphQL's nested structure (nodes, edges, pageInfo)
- Map GraphQL field names to existing data structure
- Maintain compatibility with `dynamicTemplate` configuration

**Example Transformation**:
```python
def parseGraphQLCommits(self, graphqlResponse, injectData):
    """Parse GraphQL commit response to match REST structure"""
    commits = graphqlResponse['repository']['ref']['target']['history']['nodes']

    parsedCommits = []
    for commit in commits:
        # Transform GraphQL response to match existing template
        restLikeCommit = {
            'sha': commit['oid'],
            'commit': {
                'message': commit['message'],
                'author': {
                    'name': commit['author']['name'],
                    'date': commit['author']['date']
                }
            }
        }
        parsedCommits += self.parseResponse(
            self.commitResponseTemplate,
            restLikeCommit,
            injectData
        )

    return parsedCommits
```

### Phase 5: Optimization Opportunities

**Objective**: Combine related queries to reduce API calls

#### 5.1 Combined Repository + Branches Query
```graphql
query GetRepoWithBranches($login: String!, $cursor: String) {
  user(login: $login) {
    repositories(first: 10, after: $cursor) {
      nodes {
        name
        defaultBranchRef {
          name
        }
        refs(refPrefix: "refs/heads/", first: 100) {
          nodes {
            name
            target {
              ... on Commit {
                oid
              }
            }
          }
        }
      }
    }
  }
}
```

**Impact**: Reduces 2 API calls to 1 per repository

#### 5.2 Combined Commits + Basic Stats
Already included in Phase 2.3 - eliminates need for separate commit details call in most cases.

**Expected Reduction**:
- **Before**: ~300-500 API calls for typical repository
  - 1 for repos
  - 1 per repo for branches
  - 1+ per branch for commits
  - 1 per commit for file details
  - 1+ per branch for PRs

- **After**: ~100-200 API calls
  - 1 for repos with branches
  - 1+ per branch for commits (with stats)
  - 1 per commit only if detailed file info needed
  - 1+ per branch for PRs

**Reduction**: ~40-60% fewer API calls

### Phase 6: Configuration Updates

**Objective**: Update config.json to support GraphQL

**New Configuration Fields**:
```json
{
  "useGraphQL": true,
  "graphqlEndpoint": "https://api.github.com/graphql",
  "graphqlRateLimit": {
    "checkBeforeQuery": true,
    "minPointsRequired": 100
  },
  "fallbackToREST": true,
  "graphqlQueries": {
    "repositories": "query GetRepositories...",
    "branches": "query GetBranches...",
    "commits": "query GetCommits...",
    "pullRequests": "query GetPullRequests..."
  }
}
```

**Backward Compatibility**:
- Keep all existing REST configuration
- `useGraphQL`: false by default (opt-in)
- `fallbackToREST`: true to handle unsupported features

### Phase 7: Testing & Validation

**Objective**: Ensure GraphQL implementation matches REST behavior

**Test Cases**:
1. **Data Completeness**
   - Compare REST vs GraphQL output for same repository
   - Validate all fields are captured
   - Check tracking file consistency

2. **Pagination**
   - Test with repositories having >100 branches
   - Test with branches having >100 commits
   - Verify no data loss during pagination

3. **Edge Cases**
   - Empty repositories
   - Repositories with no branches
   - Branches with no commits since `startFrom`
   - Pull requests from forks
   - Deleted branches

4. **Performance**
   - Measure API call reduction
   - Compare execution time
   - Monitor rate limit consumption

5. **Error Handling**
   - GraphQL errors (syntax, permissions)
   - Rate limit exceeded
   - Network failures
   - Fallback to REST

**Validation Checklist**:
- [ ] All REST endpoints have GraphQL equivalents
- [ ] Pagination works correctly for all queries
- [ ] Tracking files have same structure
- [ ] Published data matches REST format
- [ ] Error handling covers all scenarios
- [ ] Rate limits are respected
- [ ] Performance improvement measured
- [ ] Backward compatibility maintained

### Phase 8: Backward Compatibility

**Objective**: Ensure smooth migration without breaking existing deployments

**Strategy**:
1. **Feature Flag**: `useGraphQL` configuration option
2. **Graceful Fallback**: Automatically use REST if GraphQL fails
3. **Hybrid Mode**: Use GraphQL where possible, REST for unsupported features
4. **Configuration Validation**: Warn if GraphQL config is incomplete

**Implementation**:
```python
def shouldUseGraphQL(self):
    """Determine if GraphQL should be used"""
    if not self.config.get('useGraphQL', False):
        return False

    if not self.config.get('graphqlEndpoint'):
        self.baseLogger.warning("GraphQL enabled but endpoint not configured")
        return False

    return True

def getReposWithFallback(self):
    """Get repositories with GraphQL, fallback to REST"""
    if self.shouldUseGraphQL():
        try:
            return self.getReposGraphQL()
        except Exception as e:
            self.baseLogger.warning(f"GraphQL failed, falling back to REST: {e}")
            if self.config.get('fallbackToREST', True):
                return self.getReposREST()
            raise
    else:
        return self.getReposREST()
```

## Expected Benefits

### Performance
- **API Call Reduction**: 40-60% fewer API calls
- **Execution Time**: 30-40% faster (fewer network round-trips)
- **Rate Limit Efficiency**: Better utilization of GitHub's rate limits

### Maintainability
- **Future-Proof**: GitHub is focusing on GraphQL over REST
- **Flexibility**: Easier to add new fields without changing endpoints
- **Consistency**: Single endpoint, consistent error handling

### Data Quality
- **Completeness**: Fetch related data in single query
- **Consistency**: Atomic data retrieval (no data changes between calls)
- **Accuracy**: Cursor-based pagination more reliable

## Migration Timeline

1. **Week 1**: Phase 1-2 (Infrastructure + Query Design)
2. **Week 2**: Phase 3-4 (Pagination + Parsing)
3. **Week 3**: Phase 5-6 (Optimization + Configuration)
4. **Week 4**: Phase 7-8 (Testing + Backward Compatibility)

## Rollout Strategy

1. **Alpha**: Internal testing with `useGraphQL: true` on test repositories
2. **Beta**: Selected production repositories with close monitoring
3. **GA**: Default to GraphQL with REST fallback for 1 release
4. **Full Migration**: GraphQL only (remove REST code) after 2-3 releases

## Known Limitations

1. **File-Level Changes**: GraphQL doesn't provide per-file change details like REST
   - **Solution**: Keep REST fallback for `updateCommitFileDetails()` method
   - **Alternative**: Use Git tree comparison API (more complex)

2. **Complex Filters**: Some REST filters not available in GraphQL
   - **Solution**: Fetch broader dataset and filter in code
   - **Impact**: Minimal, as most filters are date-based (supported)

3. **Rate Limits**: GraphQL uses points system (different from REST)
   - **Solution**: Monitor query cost and adjust batch sizes
   - **Mitigation**: GraphQL is generally more efficient

## Risk Mitigation

1. **Data Loss**: Comprehensive testing + comparison with REST output
2. **Performance Degradation**: Benchmark before rollout
3. **Breaking Changes**: Feature flag + REST fallback
4. **GitHub API Changes**: Monitor GitHub changelog, version API requests

## Success Metrics

- API call reduction: Target 50%
- Execution time improvement: Target 35%
- Zero data loss: 100% match with REST
- Error rate: <1% GraphQL-specific errors
- Adoption: 100% of instances using GraphQL within 3 months

## References

- [GitHub GraphQL API Documentation](https://docs.github.com/en/graphql)
- [GitHub GraphQL Explorer](https://docs.github.com/en/graphql/overview/explorer)
- [GitHub REST to GraphQL Migration Guide](https://docs.github.com/en/graphql/guides/migrating-from-rest-to-graphql)
- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
