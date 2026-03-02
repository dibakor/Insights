#!/usr/bin/env python3
"""
Grafana Function Replacement Script

Connects to Grafana and replaces specified functions in panel queries
and template variables across all dashboards.

Usage:
    python grafana_replace_functions.py [--dry-run] [--verbose]
"""

import argparse
import csv
import json
import os
import sys
import requests
from typing import Any, Dict, List, Tuple

QUERY_FIELDS = ["query", "rawQuery", "expr", "cypher", "cypherQuery", "statement", "queryText"]


def load_config() -> Dict[str, Any]:
    """Load configuration from config.json in the same directory as the script."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(script_dir, "config.json")
    try:
        with open(config_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: config.json not found at {config_path}")
        sys.exit(1)


def get_auth(config: Dict[str, str]) -> Tuple[str, str]:
    """Get Basic Auth tuple from config."""
    return (config["grafana_user"], config["grafana_password"])


def get_headers(org_id: int = None) -> Dict[str, str]:
    """Get HTTP headers for API requests."""
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    if org_id is not None:
        headers["X-Grafana-Org-Id"] = str(org_id)
    return headers


def get_all_dashboards(grafana_url: str, auth: Tuple[str, str], headers: Dict[str, str]) -> List[Dict[str, str]]:
    """Fetch all dashboards from Grafana."""
    endpoint = f"{grafana_url}/api/search?type=dash-db"
    response = requests.get(endpoint, auth=auth, headers=headers, verify=False)
    response.raise_for_status()
    return response.json()


def get_all_orgs(grafana_url: str, auth: Tuple[str, str]) -> List[Dict[str, Any]]:
    """Fetch all organizations via GET /api/orgs (requires Grafana admin)."""
    endpoint = f"{grafana_url}/api/orgs"
    response = requests.get(endpoint, auth=auth, headers=get_headers(), verify=False)
    response.raise_for_status()
    return response.json()


def get_dashboard(grafana_url: str, uid: str, auth: Tuple[str, str], headers: Dict[str, str]) -> Dict[str, Any]:
    """Fetch a single dashboard by UID."""
    endpoint = f"{grafana_url}/api/dashboards/uid/{uid}"
    response = requests.get(endpoint, auth=auth, headers=headers, verify=False)
    response.raise_for_status()
    return response.json()


def update_dashboard(grafana_url: str, dashboard: Dict[str, Any], auth: Tuple[str, str], headers: Dict[str, str]) -> Dict[str, Any]:
    """Update a dashboard in Grafana."""
    endpoint = f"{grafana_url}/api/dashboards/db"
    
    payload = {
        "dashboard": dashboard["dashboard"],
        "message": "Updated via Grafana Function Replacement Script",
        "overwrite": True
    }
    
    if "meta" in dashboard:
        if "folderId" in dashboard["meta"]:
            payload["folderId"] = dashboard["meta"]["folderId"]
        if "folderUid" in dashboard["meta"]:
            payload["folderUid"] = dashboard["meta"]["folderUid"]
    
    response = requests.post(endpoint, json=payload, auth=auth, headers=headers, verify=False)
    response.raise_for_status()
    return response.json()


def find_and_replace_in_text(text: str, functions: List[Dict[str, str]]) -> Tuple[str, List[Dict[str, str]]]:
    """
    Find and replace function names in text.
    Returns (modified_text, list_of_replacements_made).
    """
    if not isinstance(text, str):
        return text, []
    
    replacements_made = []
    modified_text = text
    
    for func in functions:
        old_fn = func["old"]
        new_fn = func["new"]
        
        if old_fn in modified_text:
            modified_text = modified_text.replace(old_fn, new_fn)
            replacements_made.append({
                "old": old_fn,
                "new": new_fn,
                "field": "text"
            })
    
    return modified_text, replacements_made


def replace_in_panels(panels: List[Dict[str, Any]], functions: List[Dict[str, str]], verbose: bool = False) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Recursively search and replace functions in panel queries.
    Returns (modified_panels, list_of_changes).
    """
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
                    string_fields = {k: v for k, v in target.items() if isinstance(v, str) and v.strip()}
                    print(f"    [DEBUG] Panel '{panel.get('title')}' target string fields: {list(string_fields.keys())}")

                for field in QUERY_FIELDS:
                    if field in modified_target and isinstance(modified_target[field], str):
                        old_value = modified_target[field]
                        new_value, _ = find_and_replace_in_text(old_value, functions)
                        if old_value != new_value:
                            modified_target[field] = new_value
                            target_changes.append({
                                "field": field,
                                "old": old_value,
                                "new": new_value
                            })

                modified_targets.append(modified_target)
            
            modified_panel["targets"] = modified_targets
        
        if target_changes:
            panel_changes["targets"] = target_changes
        
        if "panels" in panel:
            modified_sub_panels, sub_changes = replace_in_panels(panel["panels"], functions, verbose)
            modified_panel["panels"] = modified_sub_panels
            if sub_changes:
                panel_changes["panels"] = sub_changes
        
        modified_panels.append(modified_panel)
        
        if panel_changes:
            changes.append({
                "panel_id": panel.get("id"),
                "panel_title": panel.get("title"),
                "changes": panel_changes
            })
    
    return modified_panels, changes


def replace_in_variables(variables: List[Dict[str, Any]], functions: List[Dict[str, str]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Search and replace functions in template variables.
    Returns (modified_variables, list_of_changes).
    """
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
                new_value, _ = find_and_replace_in_text(old_value, functions)
                if old_value != new_value:
                    modified_var["query"] = new_value
                    var_changes.append({"field": "query", "old": old_value, "new": new_value})

            elif isinstance(var["query"], dict) and "query" in var["query"] and isinstance(var["query"]["query"], str):
                old_value = var["query"]["query"]
                new_value, _ = find_and_replace_in_text(old_value, functions)
                if old_value != new_value:
                    modified_var["query"] = {**var["query"], "query": new_value}
                    var_changes.append({"field": "query.query", "old": old_value, "new": new_value})

        if "definition" in var and isinstance(var["definition"], str):
            old_value = var["definition"]
            new_value, _ = find_and_replace_in_text(old_value, functions)
            if old_value != new_value:
                modified_var["definition"] = new_value
                var_changes.append({"field": "definition", "old": old_value, "new": new_value})
        
        modified_variables.append(modified_var)
        
        if var_changes:
            changes.append({
                "variable_name": var.get("name"),
                "changes": var_changes
            })
    
    return modified_variables, changes


def process_dashboard(
    grafana_url: str,
    dashboard_data: Dict[str, Any],
    auth: Tuple[str, str],
    headers: Dict[str, str],
    functions: List[Dict[str, str]],
    dry_run: bool = False,
    verbose: bool = False,
    org_id: int = None,
    org_name: str = ""
) -> Dict[str, Any]:
    """
    Process a single dashboard: replace functions in panels and variables.
    Returns a result dict with information about changes made.
    """
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
        "updated": False
    }
    
    if "panels" in dashboard:
        modified_panels, panel_changes = replace_in_panels(dashboard["panels"], functions, verbose)
        if panel_changes:
            dashboard["panels"] = modified_panels
            result["panels_changed"] = True
            result["panel_changes"] = panel_changes
    
    if "templating" in dashboard and "list" in dashboard["templating"]:
        modified_variables, variable_changes = replace_in_variables(
            dashboard["templating"]["list"], functions
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
                    print(f"  [WARN] Unexpected response for {title} (uid: {uid}): status={grafana_status}")
            except requests.exceptions.RequestException as e:
                result["error"] = str(e)
                print(f"  [FAILED] Could not update: {title} (uid: {uid}) — {e}")
    
    return result


def _write_panel_rows(
    writer: "csv.DictWriter[str]",
    uid: str,
    title: str,
    panel_changes: List[Dict[str, Any]],
    org_id: int = None,
    org_name: str = ""
) -> None:
    """Recursively write panel target changes to CSV, including nested row panels."""
    for panel_change in panel_changes:
        for change in panel_change.get("changes", {}).get("targets", []):
            writer.writerow({
                "org_id": org_id if org_id is not None else "",
                "org_name": org_name,
                "dashboard_uid": uid,
                "dashboard_title": title,
                "location_type": "panel",
                "panel_id": panel_change.get("panel_id", ""),
                "panel_title": panel_change.get("panel_title", ""),
                "variable_name": "",
                "field": change.get("field", ""),
                "old_value": change.get("old", ""),
                "new_value": change.get("new", ""),
            })
        nested = panel_change.get("changes", {}).get("panels", [])
        if nested:
            _write_panel_rows(writer, uid, title, nested, org_id=org_id, org_name=org_name)


def write_csv_report(results: List[Dict[str, Any]], filepath: str) -> None:
    """Write a CSV report of all function replacements made across dashboards."""
    fieldnames = [
        "org_id", "org_name",
        "dashboard_uid", "dashboard_title",
        "location_type",
        "panel_id", "panel_title",
        "variable_name",
        "field", "old_value", "new_value"
    ]

    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

        for result in results:
            uid = result["uid"]
            title = result["title"]
            org_id = result.get("org_id")
            org_name = result.get("org_name", "")

            _write_panel_rows(writer, uid, title, result.get("panel_changes", []), org_id=org_id, org_name=org_name)

            for var_change in result.get("variable_changes", []):
                for change in var_change.get("changes", []):
                    writer.writerow({
                        "org_id": org_id if org_id is not None else "",
                        "org_name": org_name,
                        "dashboard_uid": uid,
                        "dashboard_title": title,
                        "location_type": "variable",
                        "panel_id": "",
                        "panel_title": "",
                        "variable_name": var_change.get("variable_name", ""),
                        "field": change.get("field", ""),
                        "old_value": change.get("old", ""),
                        "new_value": change.get("new", ""),
                    })


def main():
    """Main execution function."""
    parser = argparse.ArgumentParser(
        description="Replace functions in Grafana dashboard panels and variables."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview changes without updating dashboards"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show detailed output of replacements"
    )
    parser.add_argument(
        "--report",
        metavar="FILENAME",
        default="grafana_changes_report.csv",
        help="CSV report filename (default: grafana_changes_report.csv)"
    )

    args = parser.parse_args()
    
    config = load_config()
    grafana_url = config["grafana_url"].rstrip("/")
    auth = get_auth(config)
    functions = config.get("functions_to_replace", [])

    if not functions:
        print("Error: No functions to replace specified in config.json")
        sys.exit(1)

    print(f"Connecting to Grafana at {grafana_url}")
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
                    functions,
                    dry_run=args.dry_run,
                    verbose=args.verbose,
                    org_id=org_id,
                    org_name=org_name
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

    modified_label = "Dashboards that would be modified" if args.dry_run else "Dashboards successfully updated"
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
