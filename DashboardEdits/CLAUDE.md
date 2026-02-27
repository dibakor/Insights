# CLAUDE.md — DashboardEdits Project Documentation

## Project Overview

**DashboardEdits** is a Python utility for automating mass function replacement across Grafana dashboards via the Grafana HTTP API. It was built to migrate HCSC/HTEC custom date functions to APOC Neo4j standard library functions.

## Project Structure

```
DashboardEdits/
├── CLAUDE.md                              # This file
├── config.json                            # Grafana connection and replacement config
├── grafana_replace_functions.py           # Main script
└── test_grafana_replace_functions.py      # Unit and integration tests
```

## Technology Stack

- **Language**: Python 3.x
- **External dependency**: `requests` (HTTP client for Grafana API)
- **Testing**: `unittest` (standard library)
- **No package manager config** — install dependencies manually with pip

## Setup

1. Install Python 3.x
2. Install the only external dependency:
   ```bash
   pip install requests
   ```
3. Configure `config.json` with your Grafana connection details and replacement mappings (see below)

## Configuration

Edit `config.json` before running:

```json
{
  "grafana_url": "https://grafana.example.com",
  "grafana_user": "admin",
  "grafana_password": "your_password_here",
  "functions_to_replace": [
    {
      "old": "com.hcsc.htec.insights.parse(",
      "new": "apoc.date.parse("
    },
    {
      "old": "com.hcsc.htec.insights.format(",
      "new": "apoc.date.format("
    }
  ]
}
```

**Security note**: Credentials are stored in plaintext. Do not commit `config.json` to version control. SSL verification is currently disabled (`verify=False`) — enable it in production environments.

## Running the Script

```bash
# Preview changes without modifying any dashboards (recommended first step)
python grafana_replace_functions.py --dry-run --verbose

# Apply changes with detailed output
python grafana_replace_functions.py --verbose

# Apply changes silently
python grafana_replace_functions.py
```

### CLI Flags

| Flag | Description |
|------|-------------|
| `--dry-run` | Show what would change without writing to Grafana |
| `--verbose` | Print detailed replacement output per dashboard |

## Running Tests

```bash
python test_grafana_replace_functions.py
```

The test suite is comprehensive (406+ lines) and covers:

| Test Class | Coverage |
|---|---|
| `TestFindAndReplaceInText` | Core text replacement logic (8 cases) |
| `TestReplaceInPanels` | Panel query processing, nested panels (8 cases) |
| `TestReplaceInVariables` | Template variable processing (5 cases) |
| `TestHelperFunctions` | Config loading, auth, headers (2 cases) |
| `TestIntegration` | Full dashboard structure end-to-end (1 case) |

## Code Architecture

### Key Functions in `grafana_replace_functions.py`

**Configuration**
- `load_config()` — Loads and validates `config.json`
- `get_auth()` — Returns Basic Auth credentials tuple
- `get_headers()` — Builds HTTP headers for Grafana API requests

**Grafana API**
- `get_all_dashboards()` — Fetches all dashboards via `GET /api/search?type=dash-db`
- `get_dashboard(uid)` — Fetches a single dashboard by UID via `GET /api/dashboards/uid/{uid}`
- `update_dashboard(dashboard)` — Writes updated dashboard via `POST /api/dashboards/db`

**Replacement Logic**
- `find_and_replace_in_text(text, replacements)` — Performs string substitution on a single text value
- `replace_in_panels(panels, replacements, dry_run, verbose)` — Recursively processes all panels and their targets (handles nested row panels)
- `replace_in_variables(templating, replacements, dry_run, verbose)` — Processes template variable queries

**Orchestration**
- `process_dashboard(uid, title, config, dry_run, verbose)` — Drives full processing of one dashboard
- `main()` — Entry point: loads config, fetches all dashboards, processes each, prints summary stats

### Target Fields for Replacement

The script searches for function strings in these fields:

- **Panel targets**: `query`, `rawQuery`, `expr`
- **Template variables**: `query` field in `dashboard.templating.list[]`
- **Nested panels**: recursively handles panels inside row-type panels

## Execution Flow

1. Load `config.json`
2. Authenticate to Grafana
3. Fetch list of all dashboards (`/api/search`)
4. For each dashboard:
   - Fetch full dashboard JSON (`/api/dashboards/uid/{uid}`)
   - Replace function strings in panel targets and template variables
   - If not `--dry-run`, write updated dashboard back (`/api/dashboards/db`)
5. Print summary: dashboards processed, updated, errors

## Common Tasks

**Add a new function replacement mapping**: edit the `functions_to_replace` array in `config.json` — no code changes needed.

**Add a new target field to search** (e.g., `legendFormat`): update the `QUERY_FIELDS` list (or equivalent) in `replace_in_panels()` in [grafana_replace_functions.py](grafana_replace_functions.py).

**Add tests for a new scenario**: add a method to the appropriate test class in [test_grafana_replace_functions.py](test_grafana_replace_functions.py).
