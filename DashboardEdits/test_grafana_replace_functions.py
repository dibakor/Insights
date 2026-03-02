#!/usr/bin/env python3
"""
Test cases for Grafana Function Replacement Script.
"""

import unittest
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from unittest.mock import patch, MagicMock
import requests

from grafana_replace_functions import (
    find_and_replace_in_text,
    replace_in_panels,
    replace_in_variables,
    get_auth,
    get_headers,
    get_all_orgs,
    process_dashboard,
)


class TestFindAndReplaceInText(unittest.TestCase):
    """Test cases for find_and_replace_in_text function."""
    
    def setUp(self):
        self.functions = [
            {"old": "com.hcsc.htec.insights.parse(", "new": "apoc.date.parse("},
            {"old": "com.hcsc.htec.insights.format(", "new": "apoc.date.format("}
        ]
    
    def test_replace_parse_function(self):
        """Test replacing com.hcsc.htec.insights.parse with apoc.date.parse."""
        text = "RETURN com.hcsc.htec.insights.parse(timestamp, 'yyyy-MM-dd')"
        result, replacements = find_and_replace_in_text(text, self.functions)
        
        self.assertEqual(result, "RETURN apoc.date.parse(timestamp, 'yyyy-MM-dd')")
        self.assertEqual(len(replacements), 1)
        self.assertEqual(replacements[0]["old"], "com.hcsc.htec.insights.parse(")
    
    def test_replace_format_function(self):
        """Test replacing com.hcsc.htec.insights.format with apoc.date.format."""
        text = "RETURN com.hcsc.htec.insights.format(created_at)"
        result, replacements = find_and_replace_in_text(text, self.functions)
        
        self.assertEqual(result, "RETURN apoc.date.format(created_at)")
        self.assertEqual(len(replacements), 1)
    
    def test_replace_both_functions(self):
        """Test replacing both functions in same query."""
        text = "RETURN com.hcsc.htec.insights.parse(date), com.hcsc.htec.insights.format(date)"
        result, replacements = find_and_replace_in_text(text, self.functions)
        
        expected = "RETURN apoc.date.parse(date), apoc.date.format(date)"
        self.assertEqual(result, expected)
        self.assertEqual(len(replacements), 2)
    
    def test_no_replacement_needed(self):
        """Test when no function matches."""
        text = "RETURN apoc.date.parse(date)"
        result, replacements = find_and_replace_in_text(text, self.functions)
        
        self.assertEqual(result, text)
        self.assertEqual(len(replacements), 0)
    
    def test_non_string_input(self):
        """Test non-string input returns unchanged."""
        result, replacements = find_and_replace_in_text(123, self.functions)
        
        self.assertEqual(result, 123)
        self.assertEqual(len(replacements), 0)
    
    def test_partial_match_not_replaced(self):
        """Test that partial matches don't trigger replacement."""
        text = "RETURN com.hcsc.htec.insights.parseSomethingElse("
        result, replacements = find_and_replace_in_text(text, self.functions)
        
        self.assertEqual(result, text)
        self.assertEqual(len(replacements), 0)
    
    def test_empty_string(self):
        """Test empty string input."""
        result, replacements = find_and_replace_in_text("", self.functions)
        
        self.assertEqual(result, "")
        self.assertEqual(len(replacements), 0)


class TestReplaceInPanels(unittest.TestCase):
    """Test cases for replace_in_panels function."""
    
    def setUp(self):
        self.functions = [
            {"old": "com.hcsc.htec.insights.parse(", "new": "apoc.date.parse("},
            {"old": "com.hcsc.htec.insights.format(", "new": "apoc.date.format("}
        ]
    
    def test_replace_in_panel_targets_query(self):
        """Test replacing function in panel target query field."""
        panels = [
            {
                "id": 1,
                "title": "Test Panel",
                "targets": [
                    {"query": "MATCH (n) RETURN com.hcsc.htec.insights.parse(n.date)"}
                ]
            }
        ]
        
        modified_panels, changes = replace_in_panels(panels, self.functions)
        
        self.assertEqual(len(changes), 1)
        self.assertEqual(changes[0]["panel_id"], 1)
        self.assertEqual(
            modified_panels[0]["targets"][0]["query"],
            "MATCH (n) RETURN apoc.date.parse(n.date)"
        )
    
    def test_replace_in_panel_targets_raw_query(self):
        """Test replacing function in panel target rawQuery field."""
        panels = [
            {
                "id": 2,
                "title": "Raw Query Panel",
                "targets": [
                    {"rawQuery": "com.hcsc.htec.insights.format(timestamp)"}
                ]
            }
        ]
        
        modified_panels, changes = replace_in_panels(panels, self.functions)
        
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified_panels[0]["targets"][0]["rawQuery"],
            "apoc.date.format(timestamp)"
        )
    
    def test_replace_in_panel_targets_expr(self):
        """Test replacing function in panel target expr field (Prometheus)."""
        panels = [
            {
                "id": 3,
                "title": "Prometheus Panel",
                "targets": [
                    {"expr": "rate(com.hcsc.htec.insights.parse(http_requests)[5m])"}
                ]
            }
        ]
        
        modified_panels, changes = replace_in_panels(panels, self.functions)
        
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified_panels[0]["targets"][0]["expr"],
            "rate(apoc.date.parse(http_requests)[5m])"
        )
    
    def test_no_changes_needed_in_panels(self):
        """Test when panels have no matching functions."""
        panels = [
            {
                "id": 4,
                "title": "Clean Panel",
                "targets": [
                    {"query": "MATCH (n) RETURN n.name"}
                ]
            }
        ]
        
        modified_panels, changes = replace_in_panels(panels, self.functions)
        
        self.assertEqual(len(changes), 0)
        self.assertEqual(modified_panels[0]["targets"][0]["query"], "MATCH (n) RETURN n.name")
    
    def test_nested_panels(self):
        """Test replacing functions in nested panels (row panels)."""
        panels = [
            {
                "id": 1,
                "title": "Parent Panel",
                "targets": [
                    {"query": "com.hcsc.htec.insights.parse(date)"}
                ],
                "panels": [
                    {
                        "id": 2,
                        "title": "Nested Panel",
                        "targets": [
                            {"query": "com.hcsc.htec.insights.format(time)"}
                        ]
                    }
                ]
            }
        ]
        
        modified_panels, changes = replace_in_panels(panels, self.functions)
        
        self.assertEqual(len(changes), 1)
        self.assertIn("panels", changes[0]["changes"])
        self.assertEqual(
            modified_panels[0]["targets"][0]["query"],
            "apoc.date.parse(date)"
        )
        self.assertEqual(
            modified_panels[0]["panels"][0]["targets"][0]["query"],
            "apoc.date.format(time)"
        )
    
    def test_empty_panels_list(self):
        """Test with empty panels list."""
        modified_panels, changes = replace_in_panels([], self.functions)
        
        self.assertEqual(modified_panels, [])
        self.assertEqual(len(changes), 0)
    
    def test_none_panels(self):
        """Test with None panels."""
        modified_panels, changes = replace_in_panels(None, self.functions)
        
        self.assertIsNone(modified_panels)
        self.assertEqual(len(changes), 0)
    
    def test_multiple_targets(self):
        """Test replacing in panel with multiple targets."""
        panels = [
            {
                "id": 5,
                "title": "Multi Target Panel",
                "targets": [
                    {"query": "com.hcsc.htec.insights.parse(a)"},
                    {"query": "com.hcsc.htec.insights.format(b)"}
                ]
            }
        ]
        
        modified_panels, changes = replace_in_panels(panels, self.functions)
        
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified_panels[0]["targets"][0]["query"],
            "apoc.date.parse(a)"
        )
        self.assertEqual(
            modified_panels[0]["targets"][1]["query"],
            "apoc.date.format(b)"
        )


class TestReplaceInVariables(unittest.TestCase):
    """Test cases for replace_in_variables function."""
    
    def setUp(self):
        self.functions = [
            {"old": "com.hcsc.htec.insights.parse(", "new": "apoc.date.parse("},
            {"old": "com.hcsc.htec.insights.format(", "new": "apoc.date.format("}
        ]
    
    def test_replace_in_variable_query(self):
        """Test replacing function in variable query."""
        variables = [
            {
                "name": "date_format",
                "type": "query",
                "query": "MATCH (n) RETURN com.hcsc.htec.insights.format(n.date)"
            }
        ]
        
        modified_vars, changes = replace_in_variables(variables, self.functions)
        
        self.assertEqual(len(changes), 1)
        self.assertEqual(changes[0]["variable_name"], "date_format")
        self.assertEqual(
            modified_vars[0]["query"],
            "MATCH (n) RETURN apoc.date.format(n.date)"
        )
    
    def test_no_changes_needed_in_variables(self):
        """Test when variables have no matching functions."""
        variables = [
            {
                "name": "server",
                "type": "query",
                "query": "MATCH (s:Server) RETURN s.name"
            }
        ]
        
        modified_vars, changes = replace_in_variables(variables, self.functions)
        
        self.assertEqual(len(changes), 0)
        self.assertEqual(
            modified_vars[0]["query"],
            "MATCH (s:Server) RETURN s.name"
        )
    
    def test_empty_variables_list(self):
        """Test with empty variables list."""
        modified_vars, changes = replace_in_variables([], self.functions)
        
        self.assertEqual(modified_vars, [])
        self.assertEqual(len(changes), 0)
    
    def test_none_variables(self):
        """Test with None variables."""
        modified_vars, changes = replace_in_variables(None, self.functions)
        
        self.assertIsNone(modified_vars)
        self.assertEqual(len(changes), 0)
    
    def test_multiple_variables(self):
        """Test replacing in multiple variables."""
        variables = [
            {"name": "var1", "type": "query", "query": "com.hcsc.htec.insights.parse(a)"},
            {"name": "var2", "type": "query", "query": "com.hcsc.htec.insights.format(b)"},
            {"name": "var3", "type": "query", "query": "no change here"}
        ]
        
        modified_vars, changes = replace_in_variables(variables, self.functions)
        
        self.assertEqual(len(changes), 2)
        self.assertEqual(modified_vars[0]["query"], "apoc.date.parse(a)")
        self.assertEqual(modified_vars[1]["query"], "apoc.date.format(b)")
        self.assertEqual(modified_vars[2]["query"], "no change here")


class TestHelperFunctions(unittest.TestCase):
    """Test cases for helper functions."""
    
    def test_get_auth(self):
        """Test getting authentication tuple."""
        config = {
            "grafana_user": "admin",
            "grafana_password": "secret123"
        }
        
        auth = get_auth(config)
        
        self.assertEqual(auth, ("admin", "secret123"))
    
    def test_get_headers(self):
        """Test getting HTTP headers."""
        headers = get_headers()
        
        self.assertEqual(headers["Content-Type"], "application/json")
        self.assertEqual(headers["Accept"], "application/json")


class TestIntegration(unittest.TestCase):
    """Integration tests for full dashboard processing."""
    
    def setUp(self):
        self.functions = [
            {"old": "com.hcsc.htec.insights.parse(", "new": "apoc.date.parse("},
            {"old": "com.hcsc.htec.insights.format(", "new": "apoc.date.format("}
        ]
    
    def test_full_dashboard_structure(self):
        """Test processing a full dashboard structure with panels and variables."""
        dashboard = {
            "dashboard": {
                "uid": "test-123",
                "title": "Test Dashboard",
                "panels": [
                    {
                        "id": 1,
                        "title": "Panel 1",
                        "targets": [
                            {"query": "com.hcsc.htec.insights.parse(date1)"}
                        ]
                    }
                ],
                "templating": {
                    "list": [
                        {
                            "name": "dateVar",
                            "query": "com.hcsc.htec.insights.format(date2)"
                        }
                    ]
                }
            }
        }
        
        modified_dashboard = dashboard["dashboard"].copy()
        
        if "panels" in modified_dashboard:
            modified_panels, panel_changes = replace_in_panels(
                modified_dashboard["panels"], self.functions
            )
            modified_dashboard["panels"] = modified_panels
        
        if "templating" in modified_dashboard and "list" in modified_dashboard["templating"]:
            modified_vars, var_changes = replace_in_variables(
                modified_dashboard["templating"]["list"], self.functions
            )
            modified_dashboard["templating"]["list"] = modified_vars
        
        self.assertEqual(
            modified_dashboard["panels"][0]["targets"][0]["query"],
            "apoc.date.parse(date1)"
        )
        self.assertEqual(
            modified_dashboard["templating"]["list"][0]["query"],
            "apoc.date.format(date2)"
        )


class TestGetHeadersWithOrgId(unittest.TestCase):
    """Test cases for get_headers with org_id parameter."""

    def test_get_headers_no_org_id(self):
        """No X-Grafana-Org-Id header when called without org_id."""
        headers = get_headers()
        self.assertNotIn("X-Grafana-Org-Id", headers)

    def test_get_headers_with_org_id(self):
        """X-Grafana-Org-Id header added as string when org_id is provided."""
        headers = get_headers(org_id=2)
        self.assertEqual(headers["X-Grafana-Org-Id"], "2")

    def test_get_headers_org_id_is_string(self):
        """int org_id is converted to string in the header."""
        headers = get_headers(org_id=42)
        self.assertEqual(headers["X-Grafana-Org-Id"], "42")


class TestGetAllOrgs(unittest.TestCase):
    """Test cases for get_all_orgs function."""

    @patch("grafana_replace_functions.requests.get")
    def test_returns_list_of_orgs(self, mock_get):
        """Returns list of org dicts from /api/orgs."""
        orgs_data = [{"id": 1, "name": "Main Org"}, {"id": 2, "name": "Team B"}]
        mock_response = MagicMock()
        mock_response.json.return_value = orgs_data
        mock_get.return_value = mock_response

        result = get_all_orgs("https://grafana.example.com", ("admin", "pass"))

        self.assertEqual(result, orgs_data)
        called_url = mock_get.call_args[0][0]
        self.assertEqual(called_url, "https://grafana.example.com/api/orgs")

    @patch("grafana_replace_functions.requests.get")
    def test_raises_on_http_error(self, mock_get):
        """Propagates HTTPError raised by raise_for_status."""
        mock_response = MagicMock()
        mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("403 Forbidden")
        mock_get.return_value = mock_response

        with self.assertRaises(requests.exceptions.HTTPError):
            get_all_orgs("https://grafana.example.com", ("admin", "pass"))

    @patch("grafana_replace_functions.requests.get")
    def test_no_org_id_header_sent(self, mock_get):
        """Base headers (no X-Grafana-Org-Id) are used when calling /api/orgs."""
        mock_response = MagicMock()
        mock_response.json.return_value = []
        mock_get.return_value = mock_response

        get_all_orgs("https://grafana.example.com", ("admin", "pass"))

        sent_headers = mock_get.call_args[1]["headers"]
        self.assertNotIn("X-Grafana-Org-Id", sent_headers)


class TestMultiOrgIntegration(unittest.TestCase):
    """Integration tests for multi-org fields in process_dashboard results."""

    def setUp(self):
        self.functions = [
            {"old": "com.hcsc.htec.insights.parse(", "new": "apoc.date.parse("},
        ]
        self.dashboard_data = {
            "dashboard": {
                "uid": "dash-abc",
                "title": "Sample Dashboard",
                "panels": [],
                "templating": {"list": []}
            }
        }

    def test_result_contains_org_fields(self):
        """process_dashboard result includes correct org_id and org_name."""
        result = process_dashboard(
            "https://grafana.example.com",
            self.dashboard_data,
            ("admin", "pass"),
            get_headers(org_id=3),
            self.functions,
            dry_run=True,
            org_id=3,
            org_name="Team B"
        )
        self.assertEqual(result["org_id"], 3)
        self.assertEqual(result["org_name"], "Team B")

    def test_result_org_fields_default_to_none_and_empty(self):
        """process_dashboard result defaults org_id to None and org_name to empty string."""
        result = process_dashboard(
            "https://grafana.example.com",
            self.dashboard_data,
            ("admin", "pass"),
            get_headers(),
            self.functions,
            dry_run=True
        )
        self.assertIsNone(result["org_id"])
        self.assertEqual(result["org_name"], "")


def run_tests():
    """Run all tests and return results."""
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    suite.addTests(loader.loadTestsFromTestCase(TestFindAndReplaceInText))
    suite.addTests(loader.loadTestsFromTestCase(TestReplaceInPanels))
    suite.addTests(loader.loadTestsFromTestCase(TestReplaceInVariables))
    suite.addTests(loader.loadTestsFromTestCase(TestHelperFunctions))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegration))
    suite.addTests(loader.loadTestsFromTestCase(TestGetHeadersWithOrgId))
    suite.addTests(loader.loadTestsFromTestCase(TestGetAllOrgs))
    suite.addTests(loader.loadTestsFromTestCase(TestMultiOrgIntegration))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
