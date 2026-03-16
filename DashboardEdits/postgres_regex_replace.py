#!/usr/bin/env python3
"""
PostgreSQL Regex Function Replacement Script

Extends the standard PostgreSQL replacement script with regex-based pattern
matching, enabling dynamic argument transformations like:
    exists(n.timestamp)      → n.timestamp is not null
    NOT exists(n.timestamp)  → n.timestamp IS NULL

Usage:
    python postgres_regex_replace.py [--dry-run] [--verbose] [--report FILENAME]

Configuration:
    Uses postgres_config.json with an additional "regex_replacements" array.
    Each entry has:
      - "pattern": a Python regex pattern
      - "replacement": the replacement string (use \\1 for captured groups)

    Example:
    {
      "regex_replacements": [
        {
          "pattern": "(?i)not\\\\s+exists\\\\(([^)]+)\\\\)",
          "replacement": "\\\\1 IS NULL"
        },
        {
          "pattern": "exists\\\\(([^)]+)\\\\)",
          "replacement": "\\\\1 is not null"
        }
      ]
    }
"""

import argparse
import csv
import json
import os
import re
import sys
from typing import Any, Dict, List, Tuple

from postgres_replace_functions import (
    load_config,
    connect_db,
    fetch_candidate_rows,
    update_row,
    write_csv_report,
    TABLE,
    COLUMN,
    ID_COLUMN,
)


def find_and_replace_in_text(
    text: str,
    literal_replacements: List[Dict[str, str]],
    regex_replacements: List[Dict[str, str]],
) -> str:
    """
    Replace function strings using both literal and regex-based replacements.
    Returns the modified text.
    """
    if not isinstance(text, str):
        return text

    modified = text

    # Literal replacements first
    for func in literal_replacements:
        modified = modified.replace(func["old"], func["new"])

    # Regex replacements
    for rule in regex_replacements:
        modified = re.sub(rule["pattern"], rule["replacement"], modified)

    return modified


def process_rows(
    conn,
    literal_replacements: List[Dict[str, str]],
    regex_replacements: List[Dict[str, str]],
    dry_run: bool = False,
    verbose: bool = False,
) -> List[Dict[str, Any]]:
    """
    Fetch candidate rows, apply literal + regex replacements, and update the database.
    Returns a list of result dicts for rows where the text actually changed.
    """
    # Fetch rows matching literal patterns via SQL LIKE
    rows = fetch_candidate_rows(conn, literal_replacements)

    # Also fetch rows matching regex patterns using SQL ~ (POSIX regex)
    if regex_replacements:
        import psycopg2.extras

        regex_clauses = " OR ".join(
            f'"{COLUMN}" ~ %s' for _ in regex_replacements
        )
        sql = f"""
            SELECT {ID_COLUMN}, queryname, toolname, querygroup, "{COLUMN}"
            FROM {TABLE}
            WHERE {regex_clauses}
        """
        params = [rule["pattern"] for rule in regex_replacements]

        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(sql, params)
            regex_rows = [dict(row) for row in cur.fetchall()]

        # Merge, dedup by id
        seen_ids = {row[ID_COLUMN] for row in rows}
        for row in regex_rows:
            if row[ID_COLUMN] not in seen_ids:
                rows.append(row)
                seen_ids.add(row[ID_COLUMN])

    if verbose:
        print(f"  Fetched {len(rows)} candidate row(s) from DB.")

    results = []

    for row in rows:
        row_id = row[ID_COLUMN]
        queryname = row.get("queryname", "")
        toolname = row.get("toolname", "")
        querygroup = row.get("querygroup", "")
        old_value = row.get(COLUMN, "") or ""

        new_value = find_and_replace_in_text(old_value, literal_replacements, regex_replacements)

        if old_value == new_value:
            continue

        result: Dict[str, Any] = {
            "id": row_id,
            "queryname": queryname,
            "toolname": toolname,
            "querygroup": querygroup,
            "old_value": old_value,
            "new_value": new_value,
            "updated": False,
        }

        if dry_run:
            print(f"  [DRY-RUN] Would update row id={row_id} (queryname={queryname!r})")
            if verbose:
                print(f"    Old: {old_value[:120]!r}")
                print(f"    New: {new_value[:120]!r}")
            result["updated"] = False
        else:
            try:
                update_row(conn, row_id, new_value)
                result["updated"] = True
                print(f"  [SUCCESS] Updated row id={row_id} (queryname={queryname!r})")
                if verbose:
                    print(f"    Old: {old_value[:120]!r}")
                    print(f"    New: {new_value[:120]!r}")
            except Exception as e:
                result["updated"] = False
                result["error"] = str(e)
                print(f"  [FAILED] Could not update row id={row_id} (queryname={queryname!r}) — {e}")

        results.append(result)

    if not dry_run and results:
        conn.commit()

    return results


def main():
    parser = argparse.ArgumentParser(
        description="Replace functions in PostgreSQL cypherquery column using literal and regex patterns."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without writing to the database",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show detailed output including old/new query text",
    )
    parser.add_argument(
        "--report",
        metavar="FILENAME",
        default="postgres_changes_report.csv",
        help="CSV report filename (default: postgres_changes_report.csv)",
    )
    args = parser.parse_args()

    config = load_config()
    pg_config = config
    literal_replacements = config.get("functions_to_replace", [])
    regex_replacements = config.get("regex_replacements", [])

    if not literal_replacements and not regex_replacements:
        print("Error: No replacements specified in postgres_config.json")
        sys.exit(1)

    print(f"Connecting to PostgreSQL at {pg_config['host']}:{pg_config.get('port', 5432)} / {pg_config['dbname']}")
    print(f"  Literal replacements: {len(literal_replacements)}, Regex replacements: {len(regex_replacements)}")
    if args.dry_run:
        print("Running in DRY-RUN mode — no changes will be written to the database")

    try:
        conn = connect_db(pg_config)
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")
        sys.exit(1)

    try:
        results = process_rows(
            conn, literal_replacements, regex_replacements,
            dry_run=args.dry_run, verbose=args.verbose,
        )
    finally:
        conn.close()

    updated_count = sum(1 for r in results if r.get("updated"))
    failed_count = sum(1 for r in results if not r.get("updated") and "error" in r)

    print(f"\n{'='*50}")
    print("Summary:")
    print(f"  Rows with changes detected: {len(results)}")
    if args.dry_run:
        print(f"  (Dry-run mode — no actual changes written)")
    else:
        print(f"  Rows successfully updated: {updated_count}")
        if failed_count:
            print(f"  Rows failed: {failed_count}")
    print(f"{'='*50}")

    write_csv_report(results, args.report)
    print(f"\nCSV report written to: {args.report}")


if __name__ == "__main__":
    main()
