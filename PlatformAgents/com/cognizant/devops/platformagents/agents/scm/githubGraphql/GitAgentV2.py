#-------------------------------------------------------------------------------
# Copyright 2021 Cognizant Technology Solutions
# 
# Licensed under the Apache License, Version 2.0 (the "License"); you may not
# use this file except in compliance with the License.  You may obtain a copy 
# of the License at
# 
#   http://www.apache.org/licenses/LICENSE-2.0
# 
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
# License for the specific language governing permissions and limitations under
# the License.
#-------------------------------------------------------------------------------
'''
Created on Dec 07, 2021

@author: 828567
'''
import datetime
import json
import os
import re
import sys
import urllib.request, urllib.parse, urllib.error
import hashlib
from datetime import datetime as dateTime
from dateutil import parser
from ....core.BaseAgent3 import BaseAgent

class GitAgentV2(BaseAgent):
    repoTrackingPath = None
   
    @BaseAgent.timed
    def process(self):
        self.baseLogger.info('Inside GitAgent process')
        self.timeStampNow = lambda: dateTime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
        self.almRegEx = str(self.config.get("almKeyRegEx", ''))
        self.getReposUrl = self.config.get("getRepos", '')
        self.accessToken = self.getCredential("accessToken")
        self.headers = {"Authorization": "token " + self.accessToken}
        self.graphqlHeaders = {"Authorization": "Bearer " + self.accessToken, "Content-Type": "application/json"}
        self.commitsBaseEndPoint = self.config.get("commitsBaseEndPoint", '')
        self.graphqlEndpoint = self.config.get("graphqlEndpoint", "https://api.github.com/graphql")
        self.useGraphQL = self.config.get("useGraphQL", False)
        self.fallbackToREST = self.config.get("fallbackToREST", True)
        self.startFromStr = self.config.get("startFrom", '')
        self.startFrom = parser.parse(self.startFromStr, ignoretz=True)
        self.dynamicTemplate = self.config.get('dynamicTemplate', {})
        repoList = self.dynamicTemplate.get("repositories",{}).get("names",[]) #list with repositories names to include for data collection
        self.TrackingCachePathSetup('repoTracking') #creates folder for tracking json files
        self.defaultParams = 'per_page=100&page=%s'

        # Fetch repositories using GraphQL or REST based on configuration
        repos = []
        if self.shouldUseGraphQL():
            try:
                self.baseLogger.info('Fetching repositories using GraphQL')
                # Extract username from getReposUrl
                username = self.getReposUrl.split('/')[4] if len(self.getReposUrl.split('/')) > 4 else None
                if username:
                    repos = self.getReposGraphQL(username)
                else:
                    self.baseLogger.warning("Could not extract username from getReposUrl, falling back to REST")
                    repos = self._getReposREST()
            except Exception as e:
                self.baseLogger.error(f"GraphQL repository fetch failed: {str(e)}")
                if self.fallbackToREST:
                    self.baseLogger.info("Falling back to REST API for repositories")
                    repos = self._getReposREST()
                else:
                    raise
        else:
            repos = self._getReposREST()

        for repo in repos:
            repoName = repo.get('name', None)
            if len(repoList) > 0 and repoName not in repoList:
                continue
            if not os.path.isfile(self.repoTrackingPath + repoName + '.json'):
                self.UpdateTrackingCache(repoName, dict()) # creates repository wise tracking json file
            repoTrackingCache = self.TrackingCacheFileLoad(repoName)
            repoDefaultBranch = repo.get('default_branch', None)
            self.baseLogger.info('Repository default branch name: '+repoDefaultBranch)
            self.baseLogger.info('Data collection started for Repository: '+repoName)

            self.processBranchDetails(repoName, repoTrackingCache, repoDefaultBranch)

    def _getReposREST(self):
        """Fetch repositories using REST API (original implementation)"""
        self.baseLogger.info('Fetching repositories using REST API')
        allRepos = []
        repoPageNum = 1
        fetchNextPage = True
        while fetchNextPage:
            repos = self.getResponse(self.getReposUrl+'?sort=created&'+self.defaultParams % repoPageNum, 'GET', None, None, None, reqHeaders=self.headers)
            if len(repos) == 0:
                fetchNextPage = False
                break
            allRepos.extend(repos)
            repoPageNum = repoPageNum + 1
        return allRepos

    def _getBranchesREST(self, repoName):
        """Fetch branches using REST API (original implementation)"""
        self.baseLogger.info('Fetching branches using REST API')
        allBranches = []
        branchPageNum = 1
        fetchNextBranchPage = True
        while fetchNextBranchPage:
            getBranchesRestUrl = self.commitsBaseEndPoint+repoName+'/branches?'+ self.defaultParams % branchPageNum
            allBranchDetails = self.getResponse(getBranchesRestUrl, 'GET', None, None, None, reqHeaders=self.headers)
            if len(allBranchDetails) == 100:
                branchPageNum = branchPageNum + 1
            else:
                fetchNextBranchPage = False
            allBranches.extend(allBranchDetails)
        return allBranches

    def _getCommitsREST(self, repoName, branchName, since):
        """Fetch commits using REST API (original implementation)"""
        self.baseLogger.info('Fetching commits using REST API')
        allCommits = []
        encodedBranchName = urllib.parse.quote_plus(branchName.encode('utf-8'))
        getCommitDetailsUrl = self.commitsBaseEndPoint + repoName +'/commits?sha=' + encodedBranchName + '&since=' + since
        fetchNextCommitsPage = True
        commitsPageNum = 1
        while fetchNextCommitsPage:
            commits = self.getResponse(getCommitDetailsUrl+'&'+ self.defaultParams % commitsPageNum, 'GET', None,None, None, reqHeaders=self.headers)
            if len(commits) == 0 or len(commits) < 100:
                fetchNextCommitsPage = False
            allCommits.extend(commits)
            commitsPageNum = commitsPageNum + 1
        return allCommits

    def _getPullRequestsREST(self, repoName, branchName):
        """Fetch pull requests using REST API (original implementation)"""
        self.baseLogger.info('Fetching pull requests using REST API')
        allPRs = []
        ownerName = self.commitsBaseEndPoint.split('/')[4]
        pullRequestDetailsUrl = self.commitsBaseEndPoint + repoName + '/pulls?head=' + ownerName +':'+ branchName+'&state=all&sort=updated&direction=desc&' + self.defaultParams
        fetchNextPullRequestPage = True
        pullRequestPageNum = 1
        while fetchNextPullRequestPage:
            pullRequestList = self.getResponse(pullRequestDetailsUrl % pullRequestPageNum, 'GET', None,None, None, reqHeaders=self.headers)
            if len(pullRequestList) == 0 or len(pullRequestList) < 100:
                fetchNextPullRequestPage = False
            allPRs.extend(pullRequestList)
            pullRequestPageNum = pullRequestPageNum + 1
        return allPRs

    # ==================== GraphQL Helper Methods ====================

    def shouldUseGraphQL(self):
        """Determine if GraphQL should be used based on configuration"""
        if not self.useGraphQL:
            return False

        if not self.graphqlEndpoint:
            self.baseLogger.warning("GraphQL enabled but endpoint not configured, using REST")
            return False

        return True

    def executeGraphQLQuery(self, query, variables=None):
        """
        Execute a GraphQL query against GitHub API

        Args:
            query: GraphQL query string
            variables: Dictionary of variables for the query

        Returns:
            Response data from GraphQL query

        Raises:
            Exception: If GraphQL query fails
        """
        payload = {"query": query}
        if variables:
            payload["variables"] = variables

        try:
            response = self.getResponse(
                self.graphqlEndpoint,
                'POST',
                None,
                None,
                json.dumps(payload),
                reqHeaders=self.graphqlHeaders
            )

            if "errors" in response:
                errorMsg = f"GraphQL errors: {response['errors']}"
                self.baseLogger.error(errorMsg)
                raise Exception(errorMsg)

            return response.get("data", {})

        except Exception as e:
            self.baseLogger.error(f"GraphQL query execution failed: {str(e)}")
            raise

    def checkGraphQLRateLimit(self):
        """Check GraphQL API rate limit status"""
        query = """
        query {
          rateLimit {
            limit
            cost
            remaining
            resetAt
          }
        }
        """
        try:
            result = self.executeGraphQLQuery(query)
            rateLimit = result.get('rateLimit', {})
            self.baseLogger.info(f"GraphQL Rate Limit - Remaining: {rateLimit.get('remaining')}/{rateLimit.get('limit')}, Resets at: {rateLimit.get('resetAt')}")
            return rateLimit
        except Exception as e:
            self.baseLogger.warning(f"Could not check GraphQL rate limit: {str(e)}")
            return None

    # ==================== GraphQL Query Methods ====================

    def getReposGraphQL(self, username):
        """
        Fetch repositories using GraphQL API

        Args:
            username: GitHub username

        Returns:
            List of repositories with necessary information
        """
        query = """
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
        """

        allRepos = []
        cursor = None
        hasNextPage = True

        while hasNextPage:
            variables = {"login": username, "cursor": cursor}
            result = self.executeGraphQLQuery(query, variables)

            repositories = result.get('user', {}).get('repositories', {})
            repos = repositories.get('nodes', [])
            pageInfo = repositories.get('pageInfo', {})

            # Transform GraphQL response to match REST structure
            for repo in repos:
                allRepos.append({
                    'name': repo.get('name'),
                    'default_branch': repo.get('defaultBranchRef', {}).get('name', 'main')
                })

            hasNextPage = pageInfo.get('hasNextPage', False)
            cursor = pageInfo.get('endCursor')

        return allRepos

    def getBranchesGraphQL(self, owner, repoName, cursor=None):
        """
        Fetch branches using GraphQL API

        Args:
            owner: Repository owner
            repoName: Repository name
            cursor: Pagination cursor

        Returns:
            Tuple of (branches list, hasNextPage, nextCursor)
        """
        query = """
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
        """

        variables = {"owner": owner, "repo": repoName, "cursor": cursor}
        result = self.executeGraphQLQuery(query, variables)

        refs = result.get('repository', {}).get('refs', {})
        branches = refs.get('nodes', [])
        pageInfo = refs.get('pageInfo', {})

        # Transform GraphQL response to match REST structure
        transformedBranches = []
        for branch in branches:
            transformedBranches.append({
                'name': branch.get('name'),
                'commit': {
                    'sha': branch.get('target', {}).get('oid')
                }
            })

        return transformedBranches, pageInfo.get('hasNextPage', False), pageInfo.get('endCursor')

    def getCommitsGraphQL(self, owner, repoName, branchName, since, cursor=None):
        """
        Fetch commits using GraphQL API

        Args:
            owner: Repository owner
            repoName: Repository name
            branchName: Branch name
            since: Start date for commits (ISO 8601 format)
            cursor: Pagination cursor

        Returns:
            Tuple of (commits list, hasNextPage, nextCursor)
        """
        query = """
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
        """

        variables = {
            "owner": owner,
            "repo": repoName,
            "branch": branchName,
            "since": since,
            "cursor": cursor
        }

        result = self.executeGraphQLQuery(query, variables)

        history = result.get('repository', {}).get('ref', {}).get('target', {}).get('history', {})
        commits = history.get('nodes', [])
        pageInfo = history.get('pageInfo', {})

        # Transform GraphQL response to match REST structure
        transformedCommits = []
        for commit in commits:
            transformedCommits.append({
                'sha': commit.get('oid'),
                'commit': {
                    'message': commit.get('message'),
                    'author': {
                        'name': commit.get('author', {}).get('name'),
                        'date': commit.get('author', {}).get('date')
                    }
                },
                'additions': commit.get('additions'),
                'deletions': commit.get('deletions'),
                'changedFiles': commit.get('changedFiles'),
                'parents': commit.get('parents', {}).get('totalCount', 0)
            })

        return transformedCommits, pageInfo.get('hasNextPage', False), pageInfo.get('endCursor')

    def getPullRequestsGraphQL(self, owner, repoName, headRefName, cursor=None):
        """
        Fetch pull requests using GraphQL API

        Args:
            owner: Repository owner
            repoName: Repository name
            headRefName: Branch name (head ref)
            cursor: Pagination cursor

        Returns:
            Tuple of (pull requests list, hasNextPage, nextCursor)
        """
        query = """
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
        """

        variables = {
            "owner": owner,
            "repo": repoName,
            "headRefName": headRefName,
            "cursor": cursor
        }

        result = self.executeGraphQLQuery(query, variables)

        pullRequests = result.get('repository', {}).get('pullRequests', {})
        prs = pullRequests.get('nodes', [])
        pageInfo = pullRequests.get('pageInfo', {})

        # Transform GraphQL response to match REST structure
        transformedPRs = []
        for pr in prs:
            transformedPRs.append({
                'number': pr.get('number'),
                'state': pr.get('state', '').lower(),
                'created_at': pr.get('createdAt'),
                'updated_at': pr.get('updatedAt'),
                'closed_at': pr.get('closedAt'),
                'merged_at': pr.get('mergedAt'),
                'head': {
                    'ref': pr.get('headRefName'),
                    'sha': pr.get('headRefOid'),
                    'repo': {
                        'fork': pr.get('headRepository', {}).get('isFork', False) if pr.get('headRepository') else False
                    }
                },
                'base': {
                    'ref': pr.get('baseRefName'),
                    'sha': pr.get('baseRefOid')
                },
                'merge_commit_sha': pr.get('mergeCommit', {}).get('oid') if pr.get('mergeCommit') else None,
                'user': {
                    'login': pr.get('author', {}).get('login', '') if pr.get('author') else ''
                },
                'commits': pr.get('commits', {}).get('totalCount', 0),
                'changed_files': pr.get('changedFiles', 0)
            })

        return transformedPRs, pageInfo.get('hasNextPage', False), pageInfo.get('endCursor')


    def processBranchDetails(self, repoName, repoTrackingCache, repoDefaultBranch):
        self.baseLogger.info('Inside processBranchDetails method')
        allBranches = {repoDefaultBranch: False} # A dictionary with key as branchName and value as modified status
        branchData = []

        # Fetch branches using GraphQL or REST based on configuration
        allBranchDetails = []
        if self.shouldUseGraphQL():
            try:
                self.baseLogger.info('Fetching branches using GraphQL')
                owner = self.commitsBaseEndPoint.split('/')[4] if len(self.commitsBaseEndPoint.split('/')) > 4 else None
                if owner:
                    cursor = None
                    hasNextPage = True
                    while hasNextPage:
                        branches, hasNextPage, cursor = self.getBranchesGraphQL(owner, repoName, cursor)
                        allBranchDetails.extend(branches)
                else:
                    self.baseLogger.warning("Could not extract owner from commitsBaseEndPoint, falling back to REST")
                    allBranchDetails = self._getBranchesREST(repoName)
            except Exception as e:
                self.baseLogger.error(f"GraphQL branches fetch failed: {str(e)}")
                if self.fallbackToREST:
                    self.baseLogger.info("Falling back to REST API for branches")
                    allBranchDetails = self._getBranchesREST(repoName)
                else:
                    raise
        else:
            allBranchDetails = self._getBranchesREST(repoName)

        # Process branch details
        for branch in allBranchDetails:
            branchName = branch['name']
            branchTrackingDetails = repoTrackingCache.get(branchName, {})
            branchTracking = branchTrackingDetails.get('latestCommitId', None)
            #checks if latest commit details exists in tracking and update modified status in allBranches dictionary
            if branchTracking is None or branchTracking != branch.get('commit', {}).get('sha', None):
                allBranches[branchName] = True
            else:
                allBranches[branchName] = False
            if branchName not in repoTrackingCache:
                branchDict = {
                        "branchName": branch['name'],
                        "repoName": repoName,
                        "authorName":"",
                        "status":"created",
                        'consumptionTime' : self.timeStampNow()
                        }
                branchData.append(branchDict)
        if branchData:
            self.publishBranchDetails(branchData)
            self.baseLogger.info('Branch details published')
            
        # iterates over each branch and fetch commit and pull request details               
        for branch in allBranches:
            injectData = {"repoName":repoName, "branchName":branch}
            if branch == repoDefaultBranch:
                injectData['default'] = True
            else:
                injectData['default'] = False
            if allBranches[branch]:       
                self.processCommitsDetails(injectData, repoTrackingCache, repoDefaultBranch)
            self.processPullRequestDetails(repoName, branch, repoTrackingCache)
    
    #Method to fetch branch wise commit list, parse data, publish and update commit timestamp in tracking json file.
    def processCommitsDetails(self, injectData, repoTrackingCache, repoDefaultBranch):
        self.baseLogger.info('Inside processCommitsDetails method')
        commitData = []
        commitFileData = []
        defaultBranchCommitList = [] #List with default branch commit list
        branchTrackingDetails = repoTrackingCache.get(injectData["branchName"],{})
        defaultBranchCommitList = repoTrackingCache.get(repoDefaultBranch,{}).get("defaultBranchCommitList", list())
        since = branchTrackingDetails.get('latestCommitDate', None)
        if not since:
            since = self.startFrom.strftime("%Y-%m-%dT%H:%M:%SZ")
        commitResponseTemplate = self.dynamicTemplate.get('commit', {}).get('commitResponseTemplate', {})
        enableCommitFileUpdation = self.config.get("enableCommitFileUpdation", False)
        commitsMetaData = self.dynamicTemplate.get('commit', {}).get('commitMetadata', {})
        commitBranchRelationMetadata = self.dynamicTemplate.get('extensions', {}).get('commitBranchRelation', {}).get('relationMetadata', {})
        commitFileDetails = self.dynamicTemplate.get('extensions', {}).get('commitFileDetails', None)
        relationMetadata = commitFileDetails.get('relationMetadata') # relation metadata used to create commit relation with branch

        # Fetch commits using GraphQL or REST
        allCommits = []
        if self.shouldUseGraphQL():
            try:
                self.baseLogger.info('Fetching commits using GraphQL')
                owner = self.commitsBaseEndPoint.split('/')[4] if len(self.commitsBaseEndPoint.split('/')) > 4 else None
                if owner:
                    cursor = None
                    hasNextPage = True
                    # Format branch name properly for GraphQL
                    branchRef = f"refs/heads/{injectData['branchName']}"
                    while hasNextPage:
                        commits, hasNextPage, cursor = self.getCommitsGraphQL(owner, injectData["repoName"], branchRef, since, cursor)
                        allCommits.extend(commits)
                else:
                    self.baseLogger.warning("Could not extract owner from commitsBaseEndPoint, falling back to REST")
                    allCommits = self._getCommitsREST(injectData["repoName"], injectData["branchName"], since)
            except Exception as e:
                self.baseLogger.error(f"GraphQL commits fetch failed: {str(e)}")
                if self.fallbackToREST:
                    self.baseLogger.info("Falling back to REST API for commits")
                    allCommits = self._getCommitsREST(injectData["repoName"], injectData["branchName"], since)
                else:
                    raise
        else:
            allCommits = self._getCommitsREST(injectData["repoName"], injectData["branchName"], since)

        latestCommit = allCommits[0] if len(allCommits) > 0 else None

        for commit in allCommits:
            commitId = commit.get('sha', None)
            if len(defaultBranchCommitList) > 0 and commitId in defaultBranchCommitList:
                continue
            commitMessage = commit.get('commit', dict()). get('message', '')
            almKeyIter = re.finditer(self.almRegEx, commitMessage)
            almKeys = [key.group(0) for key in almKeyIter]
            if almKeys:
                injectData.update({
                'gitType':'commit',
                'almKeys' :almKeys
                })
            else:
                injectData.update({
                'gitType':'orphanCommit'
                })
            injectData['consumptionTime'] = self.timeStampNow()

            if injectData['default']:
                defaultBranchCommitList.append(commitId)

            commitData += self.parseResponse(commitResponseTemplate, commit, injectData)
            if enableCommitFileUpdation :
                commitFileData += self.updateCommitFileDetails(commitId, injectData["repoName"]) 
        
        if commitData:
            self.publishToolsData(commitData, commitsMetaData)
            self.publishToolsData(commitData,commitBranchRelationMetadata)
            self.baseLogger.info('Branch commit details published') 
            if enableCommitFileUpdation and commitFileData :
                self.publishToolsData(commitFileData, relationMetadata)
                self.baseLogger.info('Branch commit file details published') 
        
        if latestCommit:   
            self.updateCommitDetailsInTracking(injectData, latestCommit, repoTrackingCache, defaultBranchCommitList)
            self.UpdateTrackingCache(injectData["repoName"], repoTrackingCache)
            self.baseLogger.info('Branch commit details updated in tracking')
        
    
    #Method used to fetch files changed information for a particular commitId 
    def updateCommitFileDetails(self, commitId, repoName):
        self.baseLogger.info('Inside updateCommitFileDetails method')
        commitFileDetailsUrl = self.commitsBaseEndPoint + repoName + '/commits/' + commitId
        commitFileDetails =self.getResponse(commitFileDetailsUrl,'GET', None, None,None, reqHeaders=self.headers)
        commitSHA = commitFileDetails.get('sha', None)
        commitMessage = commitFileDetails.get('commit',dict()).get('message','')
        creator = commitFileDetails.get('commit',dict()).get('author',dict()).get('name','')
        commitTime = commitFileDetails.get('commit',dict()).get('author',dict()).get('date','')
        commitFiles = commitFileDetails.get('files',list())
        parentsCount = len(commitFileDetails.get('parents',list()))
        commitFileDetailsData = []
            
        for file in commitFiles:
            if (parentsCount > 1):
                break 
            
            filename = file.get('filename', None)
            status = file.get('status', None)
            deletions = file.get('deletions', None)
            additions = file.get('additions', None)
            changes = file.get('changes', None)
            filepathHash = hashlib.md5(filename.encode('utf-8')).hexdigest()
            fileExtension = os.path.splitext(filename)[1][1:]

            fileDetailsDict = {
                "commitId":commitSHA,
                "commitMessage":commitMessage,
                "authorName":creator,
                "commitTime":commitTime,
                "filename":filename,
                "status":status,
                "additions":additions,
                "deletions":deletions,
                "changes":changes,
                "filepathHash":filepathHash,
                "fileExtension":fileExtension
            }
            
            commitFileDetailsData.append(fileDetailsDict)
        
        self.baseLogger.info('File details collected for commitId: '+commitId)       
        return commitFileDetailsData 
    
    #Method to fetch Pull request details for a particular branch
    def processPullRequestDetails(self, repoName, branchName, repoTrackingCache):
        self.baseLogger.info(" inside processPullRequestDetails method ======")
        pullReqData = []
        branchTrackingDetails = repoTrackingCache.get(branchName,{})
        pullReqMetaData = self.dynamicTemplate.get('pullRequest', {}).get('metaData', {})
        pullReqinsighstTimeX = self.dynamicTemplate.get('pullRequest',{}).get('insightsTimeXFieldMapping',None)
        pullReqtimestamp = pullReqinsighstTimeX.get('timefield',None)
        pullReqtimeformat = pullReqinsighstTimeX.get('timeformat',None)
        pullReqisEpoch = pullReqinsighstTimeX.get('isEpoch',False)
        relationMetaData = self.dynamicTemplate.get('extensions', {}).get('PullReqBranchRelation', {}).get('relationMetadata', {})
        responseTemplate = self.dynamicTemplate.get('pullRequest', {}).get('pullReqResponseTemplate', {})

        # Fetch pull requests using GraphQL or REST
        pullRequestList = []
        if self.shouldUseGraphQL():
            try:
                self.baseLogger.info('Fetching pull requests using GraphQL')
                ownerName = self.commitsBaseEndPoint.split('/')[4]
                cursor = None
                hasNextPage = True
                while hasNextPage:
                    prs, hasNextPage, cursor = self.getPullRequestsGraphQL(ownerName, repoName, branchName, cursor)
                    pullRequestList.extend(prs)
            except Exception as e:
                self.baseLogger.error(f"GraphQL pull requests fetch failed: {str(e)}")
                if self.fallbackToREST:
                    self.baseLogger.info("Falling back to REST API for pull requests")
                    pullRequestList = self._getPullRequestsREST(repoName, branchName)
                else:
                    raise
        else:
            pullRequestList = self._getPullRequestsREST(repoName, branchName)

        latestPullRequest = pullRequestList[0] if len(pullRequestList) > 0 else None

        for pullRequest in pullRequestList:
            if self.startFrom > parser.parse(pullRequest["created_at"], ignoretz=True):
                continue
            if "latestPullReqUpdatedDate" in branchTrackingDetails and branchTrackingDetails["latestPullReqUpdatedDate"] == pullRequest['updated_at']:
                continue
            merged = True if pullRequest.get('merged_at', None) else False
            originBranch = pullRequest.get('head', dict()).get('ref', None)
            branchAlmKeyIter = re.finditer(self.almRegEx, originBranch)
            branchAlmKeys = [key.group(0) for key in branchAlmKeyIter]
            if branchAlmKeys:
                pullRequest['originbranchAlmKeys']= branchAlmKeys

            originRepo = pullRequest.get('head', dict()).get('repo', dict())
            creator = pullRequest.get("user",dict()).get("login", None)

            injectData = {
            'repoName': repoName,
            'isMerged': merged,
            'commits': "",
            "changed_files": "",
            'gitType': 'pullRequest',
            'consumptionTime': self.timeStampNow(),
            'authorName': creator
            }

            pullReqData += self.parseResponse(responseTemplate, pullRequest, injectData) 
            
        if pullReqData:
            self.publishToolsData(pullReqData, pullReqMetaData,pullReqtimestamp,pullReqtimeformat,pullReqisEpoch,True)
            pullReqData = [dict(item, branchName=originBranch) for item in pullReqData]
            self.publishToolsData(pullReqData, relationMetaData,pullReqtimestamp,pullReqtimeformat,pullReqisEpoch,True)
            self.baseLogger.info(" Branch pull request details published ======")
            
            self.updatePullRequestDetailsInTracking(branchName, latestPullRequest, repoTrackingCache)  
            self.UpdateTrackingCache(injectData["repoName"], repoTrackingCache)
            self.baseLogger.info(" Branch pull request details updated in tracking ======")
    
    def publishBranchDetails(self, branchData):
        self.baseLogger.info(" inside publishBranchDetails method ======")
        dynamicTemplate = self.config.get('dynamicTemplate', {})
        branchMetaData = dynamicTemplate.get('branch', {}).get('branchMetadata', {})
        branchesinsighstTimeX = dynamicTemplate.get('branch',{}).get('insightsTimeXFieldMapping',None)
        timestamp = branchesinsighstTimeX.get('timefield',None)
        timeformat = branchesinsighstTimeX.get('timeformat',None)
        isEpoch = branchesinsighstTimeX.get('isEpoch',False)
        self.publishToolsData(branchData, branchMetaData, timestamp, timeformat,isEpoch,True)

    def updateCommitDetailsInTracking(self, injectData, latestCommit, repoTrackingCache, defaultBranchCommitList):
        self.baseLogger.info('Inside updateCommitDetailsInTracking')
        updatetimestamp = latestCommit["commit"]["author"]["date"]
        dt = parser.parse(updatetimestamp)
        fromDateTime = dt + datetime.timedelta(seconds=0o1)
        fromDateTime = fromDateTime.strftime('%Y-%m-%dT%H:%M:%SZ')
        if injectData["branchName"] in repoTrackingCache:
            repoTrackingCache[injectData["branchName"]]['latestCommitDate'] = fromDateTime
            repoTrackingCache[injectData["branchName"]]['latestCommitId'] = latestCommit['sha']
        else:
            repoTrackingCache[injectData["branchName"]] = {'latestCommitDate': fromDateTime, 'latestCommitId': latestCommit["sha"]}
        if injectData["default"]:
            repoTrackingCache[injectData["branchName"]]['defaultBranchCommitList'] = defaultBranchCommitList
        
    def updatePullRequestDetailsInTracking(self, branchName, latestPullRequest, repoTrackingCache):
        self.baseLogger.info('Inside updatePullRequestDetailsInTracking')
        if branchName in repoTrackingCache:
            repoTrackingCache[branchName]['latestPullReqUpdatedDate'] = latestPullRequest['updated_at']
            repoTrackingCache[branchName]['latestPullRequestId'] = latestPullRequest['number']
            repoTrackingCache[branchName]['latestPullRequestState'] = latestPullRequest['state']
        else:
            repoTrackingCache[branchName] = {'latestPullReqUpdatedDate': latestPullRequest['updated_at'], 'latestPullRequestId': latestPullRequest['number'],
                                           'latestPullRequestState': latestPullRequest['state']}
            
    def TrackingCachePathSetup(self, folderName):
        self.baseLogger.info('Inside TrackingCachePathSetup')
        self.repoTrackingPath = os.path.dirname(sys.modules[self.__module__].__file__) + os.path.sep + folderName + os.path.sep
        if not os.path.exists(self.repoTrackingPath):
            os.mkdir(self.repoTrackingPath)

    def TrackingCacheFileLoad(self, fileName):
        self.baseLogger.info('Inside TrackingCacheFileLoad')
        with open(self.repoTrackingPath + fileName + '.json', 'r') as filePointer:
            data = json.load(filePointer)
        return data

    def UpdateTrackingCache(self, fileName, trackingDict):
        self.baseLogger.info('Inside UpdateTrackingCache')
        with open(self.repoTrackingPath + fileName + '.json', 'w') as filePointer:
            json.dump(trackingDict, filePointer, indent=4)
                

if __name__ == "__main__":
    GitAgentV2()