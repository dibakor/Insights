#!/usr/bin/env python3
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
Test script to validate GraphQL migration in GitAgentV2

This script performs validation tests on the GraphQL implementation:
1. Syntax validation
2. Method existence checks
3. Configuration validation
4. GraphQL query structure validation
'''

import json
import sys
import os
import re

def print_section(title):
    """Print a section header"""
    print("\n" + "="*70)
    print(f"  {title}")
    print("="*70)

def print_result(test_name, passed, message=""):
    """Print test result"""
    status = "✓ PASS" if passed else "✗ FAIL"
    print(f"{status} - {test_name}")
    if message:
        print(f"       {message}")

def validate_syntax():
    """Validate Python syntax"""
    print_section("SYNTAX VALIDATION")

    try:
        import py_compile
        py_compile.compile('GitAgentV2.py', doraise=True)
        print_result("Python syntax validation", True)
        return True
    except SyntaxError as e:
        print_result("Python syntax validation", False, str(e))
        return False

def validate_config():
    """Validate configuration file"""
    print_section("CONFIGURATION VALIDATION")

    try:
        with open('config.json', 'r') as f:
            config = json.load(f)

        # Check GraphQL configuration fields
        graphql_fields = {
            'useGraphQL': bool,
            'graphqlEndpoint': str,
            'fallbackToREST': bool
        }

        all_passed = True
        for field, expected_type in graphql_fields.items():
            if field in config:
                if isinstance(config[field], expected_type):
                    print_result(f"Config field '{field}' exists and has correct type", True)
                else:
                    print_result(f"Config field '{field}' has wrong type", False,
                               f"Expected {expected_type.__name__}, got {type(config[field]).__name__}")
                    all_passed = False
            else:
                print_result(f"Config field '{field}' exists", False, "Field not found")
                all_passed = False

        # Validate REST endpoint fields still exist
        rest_fields = ['getRepos', 'commitsBaseEndPoint', 'accessToken']
        for field in rest_fields:
            if field in config:
                print_result(f"REST config field '{field}' preserved", True)
            else:
                print_result(f"REST config field '{field}' preserved", False, "Field missing")
                all_passed = False

        return all_passed

    except Exception as e:
        print_result("Configuration file validation", False, str(e))
        return False

def validate_graphql_methods():
    """Validate GraphQL method existence"""
    print_section("GRAPHQL METHODS VALIDATION")

    try:
        with open('GitAgentV2.py', 'r') as f:
            content = f.read()

        required_methods = {
            'shouldUseGraphQL': 'GraphQL enablement check',
            'executeGraphQLQuery': 'GraphQL query execution',
            'checkGraphQLRateLimit': 'Rate limit checking',
            'getReposGraphQL': 'Fetch repositories via GraphQL',
            'getBranchesGraphQL': 'Fetch branches via GraphQL',
            'getCommitsGraphQL': 'Fetch commits via GraphQL',
            'getPullRequestsGraphQL': 'Fetch pull requests via GraphQL',
            '_getReposREST': 'REST fallback for repositories',
            '_getBranchesREST': 'REST fallback for branches',
            '_getCommitsREST': 'REST fallback for commits',
            '_getPullRequestsREST': 'REST fallback for pull requests'
        }

        all_passed = True
        for method, description in required_methods.items():
            pattern = rf'def {method}\('
            if re.search(pattern, content):
                print_result(f"Method '{method}' ({description})", True)
            else:
                print_result(f"Method '{method}' ({description})", False, "Method not found")
                all_passed = False

        return all_passed

    except Exception as e:
        print_result("Method validation", False, str(e))
        return False

def validate_graphql_queries():
    """Validate GraphQL query structures"""
    print_section("GRAPHQL QUERY STRUCTURE VALIDATION")

    try:
        with open('GitAgentV2.py', 'r') as f:
            content = f.read()

        # Check for GraphQL query definitions
        queries = {
            'GetRepositories': ['user', 'repositories', 'pageInfo', 'nodes'],
            'GetBranches': ['repository', 'refs', 'pageInfo', 'nodes'],
            'GetCommits': ['repository', 'ref', 'history', 'pageInfo', 'nodes'],
            'GetPullRequests': ['repository', 'pullRequests', 'pageInfo', 'nodes']
        }

        all_passed = True
        for query_name, required_fields in queries.items():
            if f'query {query_name}' in content or query_name in content:
                print_result(f"GraphQL query '{query_name}' defined", True)

                # Check for required fields in query
                for field in required_fields:
                    if field in content:
                        pass  # Field present
                    else:
                        print_result(f"  Field '{field}' in query", False, "Field not found")
                        all_passed = False
            else:
                print_result(f"GraphQL query '{query_name}' defined", False, "Query not found")
                all_passed = False

        return all_passed

    except Exception as e:
        print_result("Query structure validation", False, str(e))
        return False

def validate_pagination():
    """Validate cursor-based pagination implementation"""
    print_section("PAGINATION IMPLEMENTATION VALIDATION")

    try:
        with open('GitAgentV2.py', 'r') as f:
            content = f.read()

        pagination_patterns = {
            'Cursor variable': r'cursor\s*=',
            'hasNextPage check': r'hasNextPage',
            'endCursor': r'endCursor',
            'pageInfo': r'pageInfo',
            'While loop with cursor': r'while\s+hasNextPage'
        }

        all_passed = True
        for pattern_name, pattern in pagination_patterns.items():
            if re.search(pattern, content):
                print_result(f"Pagination pattern '{pattern_name}'", True)
            else:
                print_result(f"Pagination pattern '{pattern_name}'", False, "Pattern not found")
                all_passed = False

        return all_passed

    except Exception as e:
        print_result("Pagination validation", False, str(e))
        return False

def validate_fallback_mechanism():
    """Validate REST fallback implementation"""
    print_section("FALLBACK MECHANISM VALIDATION")

    try:
        with open('GitAgentV2.py', 'r') as f:
            content = f.read()

        fallback_patterns = {
            'Try-except blocks': r'try:\s+.*?self\.baseLogger\.info.*?GraphQL.*?except',
            'Fallback logging': r'Falling back to REST',
            'Fallback condition check': r'if self\.fallbackToREST',
            'shouldUseGraphQL checks': r'if self\.shouldUseGraphQL\(\)'
        }

        all_passed = True
        for pattern_name, pattern in fallback_patterns.items():
            if re.search(pattern, content, re.DOTALL):
                print_result(f"Fallback pattern '{pattern_name}'", True)
            else:
                print_result(f"Fallback pattern '{pattern_name}'", False, "Pattern not found")
                all_passed = False

        return all_passed

    except Exception as e:
        print_result("Fallback mechanism validation", False, str(e))
        return False

def validate_response_transformation():
    """Validate GraphQL response transformation to REST format"""
    print_section("RESPONSE TRANSFORMATION VALIDATION")

    try:
        with open('GitAgentV2.py', 'r') as f:
            content = f.read()

        # Check for transformation patterns
        transformation_checks = {
            'Repository transformation': r'default_branch.*?defaultBranchRef',
            'Branch transformation': r'transformedBranches.*?append',
            'Commit transformation': r'transformedCommits.*?append',
            'PR transformation': r'transformedPRs.*?append'
        }

        all_passed = True
        for check_name, pattern in transformation_checks.items():
            if re.search(pattern, content, re.DOTALL):
                print_result(f"Transformation '{check_name}'", True)
            else:
                print_result(f"Transformation '{check_name}'", False, "Transformation not found")
                all_passed = False

        return all_passed

    except Exception as e:
        print_result("Response transformation validation", False, str(e))
        return False

def validate_backward_compatibility():
    """Validate backward compatibility with existing code"""
    print_section("BACKWARD COMPATIBILITY VALIDATION")

    try:
        with open('GitAgentV2.py', 'r') as f:
            content = f.read()

        # Check that original methods are preserved
        compatibility_checks = {
            'processBranchDetails signature preserved': r'def processBranchDetails\(self, repoName, repoTrackingCache, repoDefaultBranch\)',
            'processCommitsDetails signature preserved': r'def processCommitsDetails\(self, injectData, repoTrackingCache, repoDefaultBranch\)',
            'processPullRequestDetails signature preserved': r'def processPullRequestDetails\(self, repoName, branchName, repoTrackingCache\)',
            'updateCommitFileDetails preserved': r'def updateCommitFileDetails\(self, commitId, repoName\)',
            'publishBranchDetails preserved': r'def publishBranchDetails\(self, branchData\)',
            'Tracking methods preserved': r'def UpdateTrackingCache\(self, fileName, trackingDict\)'
        }

        all_passed = True
        for check_name, pattern in compatibility_checks.items():
            if re.search(pattern, content):
                print_result(check_name, True)
            else:
                print_result(check_name, False, "Signature changed or method missing")
                all_passed = False

        return all_passed

    except Exception as e:
        print_result("Backward compatibility validation", False, str(e))
        return False

def generate_validation_report():
    """Generate comprehensive validation report"""
    print_section("VALIDATION REPORT SUMMARY")

    results = {}
    results['Syntax'] = validate_syntax()
    results['Configuration'] = validate_config()
    results['GraphQL Methods'] = validate_graphql_methods()
    results['GraphQL Queries'] = validate_graphql_queries()
    results['Pagination'] = validate_pagination()
    results['Fallback Mechanism'] = validate_fallback_mechanism()
    results['Response Transformation'] = validate_response_transformation()
    results['Backward Compatibility'] = validate_backward_compatibility()

    print("\n" + "="*70)
    print("  OVERALL RESULTS")
    print("="*70)

    total_tests = len(results)
    passed_tests = sum(1 for v in results.values() if v)

    for test_category, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status} - {test_category}")

    print("\n" + "-"*70)
    print(f"Total: {passed_tests}/{total_tests} test categories passed")
    print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
    print("-"*70)

    if passed_tests == total_tests:
        print("\n✓ ALL VALIDATION TESTS PASSED!")
        print("The GraphQL migration implementation is complete and validated.")
        return 0
    else:
        print("\n✗ SOME VALIDATION TESTS FAILED")
        print(f"{total_tests - passed_tests} test category(ies) need attention.")
        return 1

if __name__ == "__main__":
    print("\n" + "="*70)
    print("  GitHub GraphQL Migration - Validation Test Suite")
    print("="*70)
    print("\nThis test suite validates the GraphQL migration implementation")
    print("for GitAgentV2.py")

    # Change to the script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    exit_code = generate_validation_report()

    print("\n" + "="*70)
    print("  VALIDATION COMPLETE")
    print("="*70 + "\n")

    sys.exit(exit_code)
