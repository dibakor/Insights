#!/usr/bin/env python3
"""
Test cases for PostgreSQL Regex Function Replacement Script.
"""

import unittest
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Mock psycopg2 before importing so tests run without the DB driver installed
from unittest import mock
sys.modules["psycopg2"] = mock.MagicMock()
sys.modules["psycopg2.extras"] = mock.MagicMock()

from postgres_regex_replace import find_and_replace_in_text


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
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.timestamp is not null")

    def test_exists_with_relationship(self):
        text = "WHERE exists(r.status)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE r.status is not null")

    def test_exists_dotted_path(self):
        text = "MATCH (n) WHERE exists(n.metadata.createdAt) RETURN n"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "MATCH (n) WHERE n.metadata.createdAt is not null RETURN n")

    def test_multiple_exists(self):
        text = "WHERE exists(n.a) AND exists(n.b)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.a is not null AND n.b is not null")

    def test_not_exists_uppercase(self):
        text = "WHERE NOT exists(n.deleted)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_not_exists_lowercase(self):
        text = "WHERE not exists(n.deleted)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_not_exists_mixed_case(self):
        text = "WHERE Not exists(n.deleted)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_not_exists_extra_whitespace(self):
        text = "WHERE NOT   exists(n.deleted)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_not_exists_and_exists_together(self):
        text = "WHERE NOT exists(n.a) AND exists(n.b)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.a IS NULL AND n.b is not null")

    def test_exists_uppercase(self):
        """EXISTS in all caps should be replaced."""
        text = "WHERE EXISTS(n.timestamp)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.timestamp is not null")

    def test_exists_mixed_case(self):
        """Exists in mixed case should be replaced."""
        text = "WHERE Exists(n.timestamp)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.timestamp is not null")

    def test_exists_uppercase_dotted_path(self):
        """EXISTS with dotted property path should be replaced."""
        text = "MATCH (n) WHERE EXISTS(n.metadata.createdAt) RETURN n"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "MATCH (n) WHERE n.metadata.createdAt is not null RETURN n")

    def test_multiple_exists_mixed_case(self):
        """Multiple exists calls with different casing should all be replaced."""
        text = "WHERE EXISTS(n.a) AND exists(n.b) AND Exists(n.c)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.a is not null AND n.b is not null AND n.c is not null")

    def test_not_exists_uppercase_exists(self):
        """NOT EXISTS (both uppercase) should produce IS NULL."""
        text = "WHERE NOT EXISTS(n.deleted)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.deleted IS NULL")

    def test_mixed_exists_and_not_exists_various_cases(self):
        """Mix of NOT EXISTS and EXISTS in various casings in one query."""
        text = "WHERE NOT EXISTS(n.a) AND EXISTS(n.b) AND not Exists(n.c)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.a IS NULL AND n.b is not null AND n.c IS NULL")

    def test_no_match(self):
        text = "WHERE n.name = 'exists'"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)

    def test_non_string_input(self):
        result = find_and_replace_in_text(42, [], REGEX)
        self.assertEqual(result, 42)

    def test_empty_string(self):
        result = find_and_replace_in_text("", [], REGEX)
        self.assertEqual(result, "")

    def test_combined_literal_and_regex(self):
        text = "RETURN com.hcsc.htec.insights.parse(n.date) WHERE exists(n.date)"
        result = find_and_replace_in_text(text, LITERAL, REGEX)
        self.assertEqual(
            result,
            "RETURN apoc.date.parse(n.date) WHERE n.date is not null",
        )

    def test_literal_only(self):
        text = "RETURN com.hcsc.htec.insights.format(n.ts)"
        result = find_and_replace_in_text(text, LITERAL, [])
        self.assertEqual(result, "RETURN apoc.date.format(n.ts)")

    def test_regex_only(self):
        text = "WHERE exists(n.x)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.x is not null")

    def test_exists_relationship_not_replaced(self):
        """exists() with a relationship pattern should NOT be replaced."""
        text = "WHERE exists((n)-[:KNOWS]->(m))"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)

    def test_not_exists_relationship_not_replaced(self):
        """NOT exists() with a relationship pattern should NOT be replaced."""
        text = "WHERE NOT exists((n)-[:REL]->(m))"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)

    def test_exists_relationship_with_variable_in_same_query(self):
        """Only property exists() is replaced, relationship exists() is left alone."""
        text = "WHERE exists((n)-[:REL]->(m)) AND exists(n.name)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE exists((n)-[:REL]->(m)) AND n.name is not null")

    def test_exists_reverse_relationship_not_replaced(self):
        """exists() with a reverse relationship pattern should NOT be replaced."""
        text = "WHERE exists((n)<-[:CREATED]-(m))"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)

    def test_exists_undirected_relationship_not_replaced(self):
        """exists() with an undirected relationship pattern should NOT be replaced."""
        text = "WHERE exists((n)--(m))"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, text)

    def test_not_exists_in_parenthesized_expression(self):
        """not exists inside parentheses with OR clause should be replaced."""
        text = "(not exists(n.property) OR size(n.property)=0)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "(n.property IS NULL OR size(n.property)=0)")

    def test_exists_in_parenthesized_expression(self):
        """exists inside parentheses with AND clause should be replaced."""
        text = "AND (exists(n.property) AND n.property > 0"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "AND (n.property is not null AND n.property > 0")

    def test_not_exists_in_parens_uppercase(self):
        """NOT EXISTS inside parentheses should be replaced."""
        text = "(NOT EXISTS(n.property) OR size(n.property)=0)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "(n.property IS NULL OR size(n.property)=0)")

    def test_exists_in_parens_uppercase(self):
        """EXISTS inside parentheses should be replaced."""
        text = "AND (EXISTS(n.property) AND n.property > 0"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "AND (n.property is not null AND n.property > 0")

    def test_both_exists_forms_in_parenthesized_expression(self):
        """Both exists and not exists inside a complex parenthesized expression."""
        text = "WHERE (not exists(n.a) OR size(n.a)=0) AND (exists(n.b) AND n.b > 0)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(
            result,
            "WHERE (n.a IS NULL OR size(n.a)=0) AND (n.b is not null AND n.b > 0)",
        )

    def test_nested_parentheses_with_exists(self):
        """exists inside deeply nested parentheses should be replaced."""
        text = "WHERE ((exists(n.x)) AND (not exists(n.y)))"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE ((n.x is not null) AND (n.y IS NULL))")

    def test_not_exists_and_uppercase_exists_in_same_query(self):
        """not exists and uppercase EXISTS in the same query should both be replaced."""
        text = "and not exists(n.property) and EXISTS(n.property)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "and n.property IS NULL and n.property is not null")

    def test_where_exists_simple(self):
        """WHERE exists(n.property) should be replaced."""
        text = "WHERE exists(n.property)"
        result = find_and_replace_in_text(text, [], REGEX)
        self.assertEqual(result, "WHERE n.property is not null")


if __name__ == "__main__":
    unittest.main(verbosity=2)
