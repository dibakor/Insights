#!/usr/bin/env python3
"""
PostgreSQL Function Replacement Script

Connects to a PostgreSQL database and replaces specified function strings
in the cypherquery column of the INSIGHTS_OFFLINE_DATA_CONFIGURATION table.

Usage:
    python postgres_replace_functions.py [--dry-run] [--verbose] [--report FILENAME]
"""

import argparse
import csv
import json
import os
import sys
from typing import Any, Dict, List, Tuple

import psycopg2
import psycopg2.extras


TABLE = 'public."INSIGHTS_OFFLINE_DATA_CONFIGURATION"'
COLUMN = "cypherquery"
ID_COLUMN = "id"


def load_config() -> Dict[str, Any]:
    """Load configuration from postgres_config.json in the same directory as the script."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(script_dir, "postgres_config.json")

    if not os.path.exists(config_path):
        print(f"Error: postgres_config.json not found at {config_path}")
        sys.exit(1)

    with open(config_path, "r") as f:
        return json.load(f)


def find_and_replace_in_text(text: str, functions: List[Dict[str, str]]) -> str:
    """
    Replace all old function strings with their new equivalents.
    Returns the modified text.
    """
    if not isinstance(text, str):
        return text

    modified = text
    for func in functions:
        modified = modified.replace(func["old"], func["new"])
    return modified


def connect_db(pg_config: Dict[str, Any]):
    """Connect to PostgreSQL using psycopg2 and return the connection."""
    return psycopg2.connect(
        host=pg_config["host"],
        port=pg_config.get("port", 5432),
        dbname=pg_config["dbname"],
        user=pg_config["user"],
        password=pg_config["password"],
    )


def fetch_candidate_rows(conn, functions: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    """
    Fetch rows whose cypherquery contains at least one old function string.
    Returns a list of row dicts with keys: id, queryname, toolname, querygroup, cypherquery.
    """
    if not functions:
        return []

    like_clauses = " OR ".join(
        f'"{COLUMN}" LIKE %s' for _ in functions
    )
    sql = f"""
        SELECT {ID_COLUMN}, queryname, toolname, querygroup, "{COLUMN}"
        FROM {TABLE}
        WHERE {like_clauses}
    """
    params = [f"%{func['old']}%" for func in functions]

    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(sql, params)
        return [dict(row) for row in cur.fetchall()]


def update_row(conn, row_id: Any, new_value: str) -> None:
    """Update a single row's cypherquery value by id."""
    sql = f'UPDATE {TABLE} SET "{COLUMN}" = %s WHERE {ID_COLUMN} = %s'
    with conn.cursor() as cur:
        cur.execute(sql, (new_value, row_id))


def process_rows(
    conn,
    functions: List[Dict[str, str]],
    dry_run: bool = False,
    verbose: bool = False,
) -> List[Dict[str, Any]]:
    """
    Fetch candidate rows, apply replacements, and update the database.

    Returns a list of result dicts for rows where the text actually changed.
    """
    rows = fetch_candidate_rows(conn, functions)

    if verbose:
        print(f"  Fetched {len(rows)} candidate row(s) from DB.")

    results = []

    for row in rows:
        row_id = row[ID_COLUMN]
        queryname = row.get("queryname", "")
        toolname = row.get("toolname", "")
        querygroup = row.get("querygroup", "")
        old_value = row.get(COLUMN, "") or ""

        new_value = find_and_replace_in_text(old_value, functions)

        if old_value == new_value:
            # No change needed despite matching LIKE — partial match edge case.
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


def write_csv_report(results: List[Dict[str, Any]], filepath: str) -> None:
    """Write a CSV report of all rows where replacements were made."""
    fieldnames = ["id", "queryname", "toolname", "querygroup", "old_value", "new_value"]

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        for result in results:
            writer.writerow(result)


def main():
    parser = argparse.ArgumentParser(
        description="Replace functions in PostgreSQL cypherquery column."
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
    functions = config.get("functions_to_replace", [])
    if not functions:
        print("Error: No functions to replace specified in postgres_config.json")
        sys.exit(1)

    print(f"Connecting to PostgreSQL at {pg_config['host']}:{pg_config.get('port', 5432)} / {pg_config['dbname']}")
    if args.dry_run:
        print("Running in DRY-RUN mode — no changes will be written to the database")

    try:
        conn = connect_db(pg_config)
    except Exception as e:
        print(f"Error connecting to PostgreSQL: {e}")
        sys.exit(1)

    try:
        results = process_rows(conn, functions, dry_run=args.dry_run, verbose=args.verbose)
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
