#!/usr/bin/env python3
"""
Test cases for Grafana Regex Function Replacement Script.
"""

import unittest
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from grafana_regex_replace import (
    find_and_replace_in_text,
    replace_in_panels,
    replace_in_variables,
)


LITERAL = [
    {"old": "com.hcsc.htec.insights.parse(", "new": "apoc.date.parse("},
    {"old": "com.hcsc.htec.insights.format(", "new": "apoc.date.format("},
]

REGEX = [
    {"pattern": r"(?i)not\s+exists\(([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\)", "replacement": r"\1 IS NULL"},
    {"pattern": r"(?i)exists\(([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\)", "replacement": r"\1 is not null"},
]


class TestRegexFindAndReplace(unittest.TestCase):
    """Test regex-based replacements in find_and_replace_in_text."""

    def test_exists_simple(self):
        text = "WHERE exists(n.timestamp)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.timestamp is not null")
        self.assertEqual(len(replacements), 1)

    def test_exists_with_relationship(self):
        text = "WHERE exists(r.status)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE r.status is not null")

    def test_exists_dotted_path(self):
        text = "MATCH (n) WHERE exists(n.metadata.createdAt) RETURN n"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "MATCH (n) WHERE n.metadata.createdAt is not null RETURN n")

    def test_multiple_exists(self):
        text = "WHERE exists(n.a) AND exists(n.b)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.a is not null AND n.b is not null")

    def test_not_exists_uppercase(self):
        text = "WHERE NOT exists(n.deleted)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_not_exists_lowercase(self):
        text = "WHERE not exists(n.deleted)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_not_exists_mixed_case(self):
        text = "WHERE Not exists(n.deleted)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_not_exists_extra_whitespace(self):
        text = "WHERE NOT   exists(n.deleted)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_not_exists_and_exists_together(self):
        text = "WHERE NOT exists(n.a) AND exists(n.b)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.a IS NULL AND n.b is not null")

    def test_exists_uppercase(self):
        """EXISTS in all caps should be replaced."""
        text = "WHERE EXISTS(n.timestamp)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.timestamp is not null")
        self.assertEqual(len(replacements), 1)

    def test_exists_mixed_case(self):
        """Exists in mixed case should be replaced."""
        text = "WHERE Exists(n.timestamp)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.timestamp is not null")
        self.assertEqual(len(replacements), 1)

    def test_exists_uppercase_dotted_path(self):
        """EXISTS with dotted property path should be replaced."""
        text = "MATCH (n) WHERE EXISTS(n.metadata.createdAt) RETURN n"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "MATCH (n) WHERE n.metadata.createdAt is not null RETURN n")

    def test_multiple_exists_mixed_case(self):
        """Multiple exists calls with different casing should all be replaced."""
        text = "WHERE EXISTS(n.a) AND exists(n.b) AND Exists(n.c)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.a is not null AND n.b is not null AND n.c is not null")

    def test_not_exists_uppercase_exists(self):
        """NOT EXISTS (both uppercase) should produce IS NULL."""
        text = "WHERE NOT EXISTS(n.deleted)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_mixed_exists_and_not_exists_various_cases(self):
        """Mix of NOT EXISTS and EXISTS in various casings in one query."""
        text = "WHERE NOT EXISTS(n.a) AND EXISTS(n.b) AND not Exists(n.c)"
        result, _ = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.a IS NULL AND n.b is not null AND n.c IS NULL")

    def test_no_match(self):
        text = "WHERE n.name = 'exists'"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)
        self.assertEqual(len(replacements), 0)

    def test_non_string_input(self):
        result, replacements = find_and_replace_in_text(42, [], REGEX)
        self.assertEqual(result, 42)
        self.assertEqual(len(replacements), 0)

    def test_empty_string(self):
        result, replacements = find_and_replace_in_text("", [], REGEX)
        self.assertEqual(result, "")
        self.assertEqual(len(replacements), 0)

    def test_combined_literal_and_regex(self):
        text = "RETURN com.hcsc.htec.insights.parse(n.date) WHERE exists(n.date)"
        result, replacements = find_and_replace_in_text(text, LITERAL, REGEX)
        self.assertEqual(
            result,
            "RETURN apoc.date.parse(n.date) WHERE n.date is not null",
        )
        self.assertEqual(len(replacements), 2)

    def test_exists_relationship_not_replaced(self):
        """exists() with a relationship pattern should NOT be replaced."""
        text = "WHERE exists((n)-[:KNOWS]->(m))"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)
        self.assertEqual(len(replacements), 0)

    def test_not_exists_relationship_not_replaced(self):
        """NOT exists() with a relationship pattern should NOT be replaced."""
        text = "WHERE NOT exists((n)-[:REL]->(m))"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)
        self.assertEqual(len(replacements), 0)

    def test_exists_relationship_with_variable_in_same_query(self):
        """Only property exists() is replaced, relationship exists() is left alone."""
        text = "WHERE exists((n)-[:REL]->(m)) AND exists(n.name)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE exists((n)-[:REL]->(m)) AND n.name is not null")
        self.assertEqual(len(replacements), 1)

    def test_exists_reverse_relationship_not_replaced(self):
        """exists() with a reverse relationship pattern should NOT be replaced."""
        text = "WHERE exists((n)<-[:CREATED]-(m))"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)
        self.assertEqual(len(replacements), 0)

    def test_exists_undirected_relationship_not_replaced(self):
        """exists() with an undirected relationship pattern should NOT be replaced."""
        text = "WHERE exists((n)--(m))"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)
        self.assertEqual(len(replacements), 0)

    def test_not_exists_in_parenthesized_expression(self):
        """not exists inside parentheses with OR clause should be replaced."""
        text = "(not exists(n.property) OR size(n.property)=0)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "(n.property IS NULL OR size(n.property)=0)")
        self.assertEqual(len(replacements), 1)

    def test_exists_in_parenthesized_expression(self):
        """exists inside parentheses with AND clause should be replaced."""
        text = "AND (exists(n.property) AND n.property > 0"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "AND (n.property is not null AND n.property > 0")
        self.assertEqual(len(replacements), 1)

    def test_not_exists_in_parens_uppercase(self):
        """NOT EXISTS inside parentheses should be replaced."""
        text = "(NOT EXISTS(n.property) OR size(n.property)=0)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "(n.property IS NULL OR size(n.property)=0)")
        self.assertEqual(len(replacements), 1)

    def test_exists_in_parens_uppercase(self):
        """EXISTS inside parentheses should be replaced."""
        text = "AND (EXISTS(n.property) AND n.property > 0"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "AND (n.property is not null AND n.property > 0")
        self.assertEqual(len(replacements), 1)

    def test_both_exists_forms_in_parenthesized_expression(self):
        """Both exists and not exists inside a complex parenthesized expression."""
        text = "WHERE (not exists(n.a) OR size(n.a)=0) AND (exists(n.b) AND n.b > 0)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(
            result,
            "WHERE (n.a IS NULL OR size(n.a)=0) AND (n.b is not null AND n.b > 0)",
        )
        self.assertEqual(len(replacements), 2)

    def test_nested_parentheses_with_exists(self):
        """exists inside deeply nested parentheses should be replaced."""
        text = "WHERE ((exists(n.x)) AND (not exists(n.y)))"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE ((n.x is not null) AND (n.y IS NULL))")
        self.assertEqual(len(replacements), 2)

    def test_not_exists_and_uppercase_exists_in_same_query(self):
        """not exists and uppercase EXISTS in the same query should both be replaced."""
        text = "and not exists(n.property) and EXISTS(n.property)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "and n.property IS NULL and n.property is not null")
        self.assertEqual(len(replacements), 2)

    def test_where_exists_simple(self):
        """WHERE exists(n.property) should be replaced."""
        text = "WHERE exists(n.property)"
        result, replacements = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.property is not null")
        self.assertEqual(len(replacements), 1)


class TestRegexReplaceInPanels(unittest.TestCase):
    """Test regex replacements inside panel targets."""

    def test_panel_target_query(self):
        panels = [
            {
                "id": 1,
                "title": "Test",
                "targets": [{"query": "MATCH (n) WHERE exists(n.ts) RETURN n"}],
            }
        ]
        modified, changes = replace_in_panels(panels, [], REGEX)
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified[0]["targets"][0]["query"],
            "MATCH (n) WHERE n.ts is not null RETURN n",
        )

    def test_nested_panels(self):
        panels = [
            {
                "id": 1,
                "title": "Row",
                "panels": [
                    {
                        "id": 2,
                        "title": "Inner",
                        "targets": [{"query": "WHERE exists(n.x)"}],
                    }
                ],
            }
        ]
        modified, changes = replace_in_panels(panels, [], REGEX)
        self.assertEqual(
            modified[0]["panels"][0]["targets"][0]["query"],
            "WHERE n.x is not null",
        )

    def test_no_changes(self):
        panels = [
            {"id": 1, "title": "Clean", "targets": [{"query": "RETURN n"}]}
        ]
        modified, changes = replace_in_panels(panels, [], REGEX)
        self.assertEqual(len(changes), 0)

    def test_combined_literal_and_regex_in_panel(self):
        panels = [
            {
                "id": 1,
                "title": "Combo",
                "targets": [
                    {
                        "query": "RETURN com.hcsc.htec.insights.parse(n.d) WHERE exists(n.d)"
                    }
                ],
            }
        ]
        modified, changes = replace_in_panels(panels, LITERAL, REGEX)
        self.assertEqual(
            modified[0]["targets"][0]["query"],
            "RETURN apoc.date.parse(n.d) WHERE n.d is not null",
        )


    def test_panel_target_uppercase_exists(self):
        """EXISTS in uppercase inside a panel target should be replaced."""
        panels = [
            {
                "id": 1,
                "title": "Test",
                "targets": [{"query": "MATCH (n) WHERE EXISTS(n.ts) RETURN n"}],
            }
        ]
        modified, changes = replace_in_panels(panels, [], REGEX)
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified[0]["targets"][0]["query"],
            "MATCH (n) WHERE n.ts is not null RETURN n",
        )

    def test_panel_target_mixed_case_exists(self):
        """Exists in mixed case inside a panel target should be replaced."""
        panels = [
            {
                "id": 1,
                "title": "Test",
                "targets": [{"query": "WHERE Exists(n.status) AND NOT EXISTS(n.deleted)"}],
            }
        ]
        modified, changes = replace_in_panels(panels, [], REGEX)
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified[0]["targets"][0]["query"],
            "WHERE n.status is not null AND n.deleted IS NULL",
        )

    def test_panel_target_parenthesized_not_exists(self):
        """not exists inside parentheses in a panel target should be replaced."""
        panels = [
            {
                "id": 1,
                "title": "Test",
                "targets": [{"query": "(not exists(n.property) OR size(n.property)=0)"}],
            }
        ]
        modified, changes = replace_in_panels(panels, [], REGEX)
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified[0]["targets"][0]["query"],
            "(n.property IS NULL OR size(n.property)=0)",
        )

    def test_panel_target_parenthesized_exists(self):
        """exists inside parentheses in a panel target should be replaced."""
        panels = [
            {
                "id": 1,
                "title": "Test",
                "targets": [{"query": "AND (exists(n.property) AND n.property > 0"}],
            }
        ]
        modified, changes = replace_in_panels(panels, [], REGEX)
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified[0]["targets"][0]["query"],
            "AND (n.property is not null AND n.property > 0",
        )


class TestRegexReplaceInVariables(unittest.TestCase):
    """Test regex replacements inside template variables."""

    def test_variable_query_string(self):
        variables = [
            {"name": "v1", "query": "MATCH (n) WHERE exists(n.env) RETURN n.env"}
        ]
        modified, changes = replace_in_variables(variables, [], REGEX)
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified[0]["query"],
            "MATCH (n) WHERE n.env is not null RETURN n.env",
        )

    def test_variable_nested_query(self):
        variables = [
            {"name": "v2", "query": {"query": "WHERE exists(n.region)"}}
        ]
        modified, changes = replace_in_variables(variables, [], REGEX)
        self.assertEqual(
            modified[0]["query"]["query"],
            "WHERE n.region is not null",
        )

    def test_variable_definition_field(self):
        variables = [
            {
                "name": "v3",
                "query": "clean",
                "definition": "WHERE exists(n.team)",
            }
        ]
        modified, changes = replace_in_variables(variables, [], REGEX)
        self.assertEqual(modified[0]["definition"], "WHERE n.team is not null")

    def test_variable_query_uppercase_exists(self):
        """EXISTS in uppercase inside a variable query should be replaced."""
        variables = [
            {"name": "v5", "query": "MATCH (n) WHERE EXISTS(n.env) RETURN n.env"}
        ]
        modified, changes = replace_in_variables(variables, [], REGEX)
        self.assertEqual(len(changes), 1)
        self.assertEqual(
            modified[0]["query"],
            "MATCH (n) WHERE n.env is not null RETURN n.env",
        )

    def test_variable_definition_uppercase_exists(self):
        """EXISTS in uppercase inside a variable definition should be replaced."""
        variables = [
            {
                "name": "v6",
                "query": "clean",
                "definition": "WHERE EXISTS(n.team)",
            }
        ]
        modified, changes = replace_in_variables(variables, [], REGEX)
        self.assertEqual(modified[0]["definition"], "WHERE n.team is not null")

    def test_no_changes(self):
        variables = [{"name": "v4", "query": "RETURN 1"}]
        modified, changes = replace_in_variables(variables, [], REGEX)
        self.assertEqual(len(changes), 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
