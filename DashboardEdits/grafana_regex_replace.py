#!/usr/bin/env python3
"""
Grafana Regex Function Replacement Script

Extends the standard replacement script with regex-based pattern matching,
enabling dynamic argument transformations like:
    exists(n.timestamp) → n.timestamp is not null

Usage:
    python grafana_regex_replace.py [--dry-run] [--verbose] [--report FILENAME]

Configuration:
    Uses config.json with an additional "regex_replacements" array. Each entry has:
      - "pattern": a Python regex pattern (use a named group for the argument)
      - "replacement": the replacement string (use \\1 or named backreferences)

    Example config.json entry:
    {
      "regex_replacements": [
        {
          "pattern": "exists\\(([^)]+)\\)",
          "replacement": "\\1 is not null"
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
import requests
from typing import Any, Dict, List, Tuple

# Reuse shared components from the original script
from grafana_replace_functions import (
    load_config,
    get_auth,
    get_headers,
    get_all_dashboards,
    get_all_orgs,
    get_dashboard,
    update_dashboard,
    write_csv_report,
    QUERY_FIELDS,
)


def find_and_replace_in_text(
    text: str,
    literal_replacements: List[Dict[str, str]],
    regex_replacements: List[Dict[str, str]],
) -> Tuple[str, List[Dict[str, str]]]:
    """
    Find and replace in text using both literal and regex-based replacements.
    Returns (modified_text, list_of_replacements_made).
    """
    if not isinstance(text, str):
        return text, []

    replacements_made = []
    modified_text = text

    # Literal replacements (same as original)
    for func in literal_replacements:
        old_fn = func["old"]
        new_fn = func["new"]
        if old_fn in modified_text:
            modified_text = modified_text.replace(old_fn, new_fn)
            replacements_made.append({"old": old_fn, "new": new_fn, "field": "text"})

    # Regex replacements
    for rule in regex_replacements:
        pattern = rule["pattern"]
        replacement = rule["replacement"]
        new_text = re.sub(pattern, replacement, modified_text)
        if new_text != modified_text:
            replacements_made.append(
                {"old": pattern, "new": replacement, "field": "regex"}
            )
            modified_text = new_text

    return modified_text, replacements_made


def replace_in_panels(
    panels: List[Dict[str, Any]],
    literal_replacements: List[Dict[str, str]],
    regex_replacements: List[Dict[str, str]],
    verbose: bool = False,
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """Recursively search and replace functions in panel queries."""
    if not panels:
        return panels, []

    changes = []
    modified_panels = []

    for panel in panels:
        panel_changes = {}
        modified_panel = panel.copy()
        target_changes = []

        if "targets" in panel:
            modified_targets = []
            for target in panel["targets"]:
                modified_target = target.copy()

                if verbose:
                    string_fields = {
                        k: v
                        for k, v in target.items()
                        if isinstance(v, str) and v.strip()
                    }
                    print(
                        f"    [DEBUG] Panel '{panel.get('title')}' target string fields: {list(string_fields.keys())}"
                    )

                for field in QUERY_FIELDS:
                    if field in modified_target and isinstance(
                        modified_target[field], str
                    ):
                        old_value = modified_target[field]
                        new_value, _ = find_and_replace_in_text(
                            old_value, literal_replacements, regex_replacements
                        )
                        if old_value != new_value:
                            modified_target[field] = new_value
                            target_changes.append(
                                {"field": field, "old": old_value, "new": new_value}
                            )

                modified_targets.append(modified_target)

            modified_panel["targets"] = modified_targets

        if target_changes:
            panel_changes["targets"] = target_changes

        if "panels" in panel:
            modified_sub_panels, sub_changes = replace_in_panels(
                panel["panels"], literal_replacements, regex_replacements, verbose
            )
            modified_panel["panels"] = modified_sub_panels
            if sub_changes:
                panel_changes["panels"] = sub_changes

        modified_panels.append(modified_panel)

        if panel_changes:
            changes.append(
                {
                    "panel_id": panel.get("id"),
                    "panel_title": panel.get("title"),
                    "changes": panel_changes,
                }
            )

    return modified_panels, changes


def replace_in_variables(
    variables: List[Dict[str, Any]],
    literal_replacements: List[Dict[str, str]],
    regex_replacements: List[Dict[str, str]],
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """Search and replace functions in template variables."""
    if not variables:
        return variables, []

    changes = []
    modified_variables = []

    for var in variables:
        modified_var = var.copy()
        var_changes = []

        if "query" in var:
            if isinstance(var["query"], str):
                old_value = var["query"]
                new_value, _ = find_and_replace_in_text(
                    old_value, literal_replacements, regex_replacements
                )
                if old_value != new_value:
                    modified_var["query"] = new_value
                    var_changes.append(
                        {"field": "query", "old": old_value, "new": new_value}
                    )

            elif (
                isinstance(var["query"], dict)
                and "query" in var["query"]
                and isinstance(var["query"]["query"], str)
            ):
                old_value = var["query"]["query"]
                new_value, _ = find_and_replace_in_text(
                    old_value, literal_replacements, regex_replacements
                )
                if old_value != new_value:
                    modified_var["query"] = {**var["query"], "query": new_value}
                    var_changes.append(
                        {"field": "query.query", "old": old_value, "new": new_value}
                    )

        if "definition" in var and isinstance(var["definition"], str):
            old_value = var["definition"]
            new_value, _ = find_and_replace_in_text(
                old_value, literal_replacements, regex_replacements
            )
            if old_value != new_value:
                modified_var["definition"] = new_value
                var_changes.append(
                    {"field": "definition", "old": old_value, "new": new_value}
                )

        modified_variables.append(modified_var)

        if var_changes:
            changes.append({"variable_name": var.get("name"), "changes": var_changes})

    return modified_variables, changes


def process_dashboard(
    grafana_url: str,
    dashboard_data: Dict[str, Any],
    auth: Tuple[str, str],
    headers: Dict[str, str],
    literal_replacements: List[Dict[str, str]],
    regex_replacements: List[Dict[str, str]],
    dry_run: bool = False,
    verbose: bool = False,
    org_id: int = None,
    org_name: str = "",
) -> Dict[str, Any]:
    """Process a single dashboard: replace functions in panels and variables."""
    dashboard = dashboard_data["dashboard"]
    uid = dashboard.get("uid", "unknown")
    title = dashboard.get("title", "Untitled")

    result = {
        "uid": uid,
        "title": title,
        "org_id": org_id,
        "org_name": org_name,
        "panels_changed": False,
        "variables_changed": False,
        "panel_changes": [],
        "variable_changes": [],
        "updated": False,
    }

    if "panels" in dashboard:
        modified_panels, panel_changes = replace_in_panels(
            dashboard["panels"], literal_replacements, regex_replacements, verbose
        )
        if panel_changes:
            dashboard["panels"] = modified_panels
            result["panels_changed"] = True
            result["panel_changes"] = panel_changes

    if "templating" in dashboard and "list" in dashboard["templating"]:
        modified_variables, variable_changes = replace_in_variables(
            dashboard["templating"]["list"], literal_replacements, regex_replacements
        )
        if variable_changes:
            dashboard["templating"]["list"] = modified_variables
            result["variables_changed"] = True
            result["variable_changes"] = variable_changes

    if result["panels_changed"] or result["variables_changed"]:
        if dry_run:
            print(f"  [DRY-RUN] Would update: {title} (uid: {uid})")
        else:
            try:
                response = update_dashboard(grafana_url, dashboard_data, auth, headers)
                grafana_status = response.get("status", "unknown")
                if grafana_status == "success":
                    result["updated"] = True
                    print(f"  [SUCCESS] Updated: {title} (uid: {uid})")
                else:
                    result["error"] = f"Unexpected status: {grafana_status}"
                    print(
                        f"  [WARN] Unexpected response for {title} (uid: {uid}): status={grafana_status}"
                    )
            except requests.exceptions.RequestException as e:
                result["error"] = str(e)
                print(f"  [FAILED] Could not update: {title} (uid: {uid}) — {e}")

    return result


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(
        description="Replace functions in Grafana dashboards using literal and regex patterns."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without updating dashboards",
    )
    parser.add_argument(
        "--verbose", action="store_true", help="Show detailed output of replacements"
    )
    parser.add_argument(
        "--report",
        metavar="FILENAME",
        default="grafana_changes_report.csv",
        help="CSV report filename (default: grafana_changes_report.csv)",
    )

    args = parser.parse_args()

    config = load_config()
    grafana_url = config["grafana_url"].rstrip("/")
    auth = get_auth(config)
    literal_replacements = config.get("functions_to_replace", [])
    regex_replacements = config.get("regex_replacements", [])

    if not literal_replacements and not regex_replacements:
        print("Error: No replacements specified in config.json")
        sys.exit(1)

    print(f"Connecting to Grafana at {grafana_url}")
    print(
        f"  Literal replacements: {len(literal_replacements)}, Regex replacements: {len(regex_replacements)}"
    )
    if args.dry_run:
        print("Running in DRY-RUN mode - no changes will be made")

    try:
        orgs = get_all_orgs(grafana_url, auth)
    except requests.exceptions.RequestException as e:
        print(f"Error fetching organizations: {e}")
        sys.exit(1)

    print(f"Found {len(orgs)} organization(s)")

    total_dashboards_scanned = 0
    total_modified = 0
    all_results = []

    for org in orgs:
        org_id = org["id"]
        org_name = org.get("name", f"Org {org_id}")
        print(f"\n--- Processing org: {org_name} (id={org_id}) ---")
        org_headers = get_headers(org_id=org_id)

        try:
            dashboards = get_all_dashboards(grafana_url, auth, org_headers)
        except requests.exceptions.RequestException as e:
            print(f"  Error fetching dashboards for org {org_name}: {e}")
            continue

        print(f"  Found {len(dashboards)} dashboard(s)")

        for dashboard_info in dashboards:
            uid = dashboard_info.get("uid")
            if not uid:
                continue
            try:
                dashboard_data = get_dashboard(grafana_url, uid, auth, org_headers)
                result = process_dashboard(
                    grafana_url,
                    dashboard_data,
                    auth,
                    org_headers,
                    literal_replacements,
                    regex_replacements,
                    dry_run=args.dry_run,
                    verbose=args.verbose,
                    org_id=org_id,
                    org_name=org_name,
                )
                all_results.append(result)
                total_dashboards_scanned += 1
                if args.dry_run:
                    if result["panels_changed"] or result["variables_changed"]:
                        total_modified += 1
                elif result.get("updated"):
                    total_modified += 1
            except requests.exceptions.RequestException as e:
                print(f"  Error processing dashboard {uid}: {e}")
                continue

    modified_label = (
        "Dashboards that would be modified"
        if args.dry_run
        else "Dashboards successfully updated"
    )
    print(f"\n{'='*50}")
    print("Summary:")
    print(f"  Organizations processed: {len(orgs)}")
    print(f"  Total dashboards scanned: {total_dashboards_scanned}")
    print(f"  {modified_label}: {total_modified}")
    print(f"{'='*50}")

    write_csv_report(all_results, args.report)
    print(f"\nCSV report written to: {args.report}")


if __name__ == "__main__":
    main()
