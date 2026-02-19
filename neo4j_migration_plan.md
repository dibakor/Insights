# Neo4j 4.4 to 5.26 Migration Plan

## Executive Summary

This plan covers migrating the CCAP Insights platform from Neo4j 4.4.4 to Neo4j 5.26 LTS. The migration involves both **database migration** and **application code changes** to support the new Neo4j 5.x REST API and Cypher syntax.

**Key Challenge**: The codebase uses Neo4j's REST HTTP API (not the Java driver), and the legacy REST endpoints (`/db/data/...`) are **removed in Neo4j 5.x**.

**Edition**: Neo4j Community (single database only, no clustering)

---

## Phase 1: Pre-Migration Assessment & Preparation

### 1.1 Infrastructure Requirements
- [x] **Java Version**: Already on Java 17+ (confirmed)
- [ ] **Server Requirements**: Verify Neo4j 5.26 system requirements (memory, disk space)
- [ ] **APOC Installation**: Plan for APOC Core 5.x installation (APOC Extended is now separate)
- [ ] **Deployment**: Standalone instance (simplifies migration)

### 1.2 Database Backup
- [ ] Create a full backup/dump of all Neo4j 4.4 databases
- [ ] Document existing indexes and constraints
- [ ] Record node and relationship counts for validation

### 1.3 Index Migration (BTREE to RANGE/POINT/TEXT) - CRITICAL

**Neo4j 5.x will fail to start if BTREE indexes exist without equivalent replacements.**

#### Step 1: List All Existing BTREE Indexes (Run in Neo4j 4.4)
```cypher
-- Show all indexes with their types
SHOW INDEXES YIELD name, type, labelsOrTypes, properties, indexProvider
WHERE type = 'BTREE'
RETURN name, labelsOrTypes, properties, indexProvider
```

#### Step 2: Index Type Selection Guide

| Current Usage | Replace With | When to Use |
|--------------|--------------|-------------|
| Equality checks (`=`) | **RANGE** | Most common replacement |
| Range comparisons (`>`, `<`, `>=`, `<=`) | **RANGE** | Number/date ranges |
| ORDER BY queries | **RANGE** | Sorting performance |
| STARTS WITH on strings | **RANGE** | Prefix searches |
| CONTAINS on strings | **TEXT** | Substring searches |
| ENDS WITH on strings | **TEXT** | Suffix searches |
| Strings > 8KB | **TEXT** | Large text fields |
| Spatial/geographic data | **POINT** | Distance/bounding box |
| Composite indexes (multi-property) | **RANGE** | Only RANGE supports composite |

#### Step 3: Create Replacement Indexes (Run in Neo4j 4.4 BEFORE migration)

```cypher
-- RANGE index (default replacement for most BTREE)
CREATE RANGE INDEX idx_label_property IF NOT EXISTS
FOR (n:Label) ON (n.property)

-- RANGE composite index (for multi-property BTREE)
CREATE RANGE INDEX idx_label_composite IF NOT EXISTS
FOR (n:Label) ON (n.prop1, n.prop2)

-- TEXT index (for CONTAINS/ENDS WITH queries)
CREATE TEXT INDEX idx_label_text IF NOT EXISTS
FOR (n:Label) ON (n.textProperty)

-- POINT index (for spatial data)
CREATE POINT INDEX idx_label_point IF NOT EXISTS
FOR (n:Label) ON (n.locationProperty)
```

#### Step 4: Wait for Indexes to Populate
```cypher
-- Check index population status
SHOW INDEXES YIELD name, state, populationPercent
WHERE state <> 'ONLINE'
```

#### Step 5: Verify Replacement Indexes Exist
```cypher
-- For each BTREE index, verify a RANGE/TEXT/POINT equivalent exists
SHOW INDEXES YIELD name, type, labelsOrTypes, properties
ORDER BY labelsOrTypes, properties
```

#### Step 6: (Optional) Drop BTREE Indexes After Creating Replacements
```cypher
-- Only if you want to clean up before migration
-- Neo4j 5.x will automatically ignore BTREE indexes
DROP INDEX btree_index_name IF EXISTS
```

### 1.4 Constraint Migration

Constraints backed by BTREE indexes also need attention:

```cypher
-- Show all constraints
SHOW CONSTRAINTS YIELD name, type, labelsOrTypes, properties, ownedIndex

-- Unique constraints will be automatically migrated
-- No action needed for constraints, only their backing indexes
```

---

## Phase 2: Application Code Changes

### 2.1 GraphDBHandler.java (Critical)
**File**: `PlatformCommons/src/main/java/com/cognizant/devops/platformcommons/dal/neo4j/GraphDBHandler.java`

**Changes Required**:

| Current (4.4) | New (5.26) | Lines |
|--------------|------------|-------|
| `/db/data/transaction/commit` | `/db/{databaseName}/tx/commit` | 43 |
| `/db/data/schema/index/` | Use Cypher `SHOW INDEXES` | 44 |
| Version check `contains("4.")` | Add `contains("5.")` | 52, 69 |

**Updated Logic**:
```java
// Constructor changes
if (version != null && (version.contains("4.") || version.contains("5."))) {
    String databaseName = ApplicationConfigProvider.getInstance().getGraph().getDatabaseName();
    COMMIT_URL = "/db/" + databaseName + "/tx/commit";
    SCHEMAURL = null; // Schema index REST API removed in 5.x
}
```

**Schema Index Methods** (lines 352-377) - REST API removed in 5.x:

`loadFieldIndices()` - Replace REST call with Cypher:
```java
// Old: REST GET /db/data/schema/index/
// New: Use Cypher query
public JsonArray loadFieldIndices() throws InsightsCustomException {
    String query = "SHOW INDEXES YIELD name, type, labelsOrTypes, properties, state";
    JsonObject response = executeCypherQueryForJsonResponse(query);
    // Parse response into JsonArray format
    return parseIndexResponse(response);
}
```

`addFieldIndex()` - Replace REST call with Cypher:
```java
// Old: REST POST /db/data/schema/index/{label}
// New: Use Cypher CREATE RANGE INDEX (default for Neo4j 5.x)
public JsonObject addFieldIndex(String label, String field) throws InsightsCustomException {
    // Use RANGE index as default (replaces BTREE)
    String query = String.format(
        "CREATE RANGE INDEX IF NOT EXISTS FOR (n:%s) ON (n.%s)",
        label, field
    );
    return executeCypherQueryForJsonResponse(query);
}
```

### 2.2 GraphData.java
**File**: `PlatformCommons/src/main/java/com/cognizant/devops/platformcommons/config/GraphData.java`

**Change**: Update default version
```java
// Line 38: Change from
private String version = "3.5.26";
// To
private String version = "5.26";
```

### 2.3 HealthUtil.java
**File**: `PlatformDAL/src/main/java/com/cognizant/devops/platformdal/healthutil/HealthUtil.java`

**Changes**:
- Line 366: `apoc.monitor.store()` - Verify compatibility with APOC 5.x
- Line 677: `/db/data/` endpoint check - Update to `/db/{databaseName}/tx`

### 2.4 Constraint Syntax Updates
**Files**:
- `PlatformService/.../BusinessMappingServiceImpl.java` (line 52-54)
- `PlatformEngine/.../EngineTestData.java` (line 272-274)

**Change**: Update version detection to include 5.x
```java
// Current: version.contains("4.")
// New: version.contains("4.") || version.contains("5.")
```

### 2.5 GrafanaUtilities.java
**File**: `PlatformService/src/main/java/com/cognizant/devops/platformservice/assessmentreport/service/GrafanaUtilities.java`

**Line 186**: Update datasource URL
```java
// From: "/db/data/transaction/commit?includeStats=true"
// To: "/db/" + databaseName + "/tx/commit?includeStats=true"
```

### 2.6 Neo4jArchivalAgent.py
**File**: `PlatformAgents/com/cognizant/devops/platformagents/agents/system/neo4jarchival/Neo4jArchivalAgent.py`

**Line 1003**: Replace deprecated procedure
```python
# From: result = tx.run("call db.indexes ").data()
# To: result = tx.run("SHOW INDEXES").data()
```

### 2.7 Grafana Plugin Updates (Detailed)

**Location**: `PlatformGrafanaPlugins/DataSources/neo4j-4/`

#### 2.7.1 ConfigEditor.tsx - Default URL Update (CRITICAL)

**File**: `src/ConfigEditor.tsx` (line 126)

**Current Code**:
```tsx
<DataSourceHttpSettings
  defaultUrl="http://localhost:7474/db/data/transaction/commit?includeStats=true"
  ...
/>
```

**Required Change**:
```tsx
<DataSourceHttpSettings
  defaultUrl="http://localhost:7474/db/neo4j/tx/commit?includeStats=true"
  ...
/>
```

**Why**: The legacy endpoint `/db/data/transaction/commit` is **removed** in Neo4j 5.x. The new endpoint pattern is `/db/{databaseName}/tx/commit` where `databaseName` is `neo4j` for Community Edition.

#### 2.7.2 plugin.json - Metadata Updates (Optional)

**File**: `src/plugin.json`

**Changes**:
```json
{
  "name": "Neo4j 5.x Datasource",           // Was: "Neo4j 4.0 Datasource"
  "id": "cts-neo-4-j-4-0",                  // Keep same ID for backward compatibility
  "info": {
    "description": "Neo4j 5.x Datasource",  // Was: "Neo4j 4.0 Datasource"
  }
}
```

**Note**: Changing the plugin ID would require re-adding the datasource in existing Grafana dashboards. Keep the same ID for backward compatibility.

#### 2.7.3 types.ts - Add Database Name Configuration (Recommended)

**File**: `src/types.ts`

**Add new field to `MyDataSourceOptions`**:
```typescript
export interface MyDataSourceOptions extends DataSourceJsonData {
  path?: string;
  basicPassword: string;
  logging: any;
  serviceUrl: any;
  authToken: any;
  databaseName?: string;  // NEW: Allow configuring database name (default: "neo4j")
}
```

**Update defaults**:
```typescript
export const defaults: MyDataSourceOptions = {
  logging: true,
  path: '',
  serviceUrl: '',
  authToken: true,
  basicPassword: '',
  databaseName: 'neo4j'  // NEW: Default for Community Edition
}
```

#### 2.7.4 ConfigEditor.tsx - Add Database Name Input Field (Recommended)

**File**: `src/ConfigEditor.tsx`

**Add handler method**:
```tsx
onDatabaseNameChange = (event: ChangeEvent<HTMLInputElement>) => {
  const { onOptionsChange, options } = this.props;
  const jsonData = {
    ...options.jsonData,
    databaseName: event.target.value,
  };
  onOptionsChange({ ...options, jsonData });
};
```

**Add input field in render() after DataSourceHttpSettings block**:
```tsx
<div className="gf-form-group">
  <h3 className="page-heading">Neo4j Database Settings</h3>
  <div className="gf-form">
    <LegacyForms.FormField
      label="Database Name"
      labelWidth={10}
      inputWidth={20}
      onChange={this.onDatabaseNameChange}
      value={jsonData.databaseName || 'neo4j'}
      placeholder="neo4j"
      tooltip="Database name (Community Edition only supports 'neo4j')"
    />
  </div>
</div>
```

#### 2.7.5 Files Requiring No Changes

| File | Reason |
|------|--------|
| `src/DataSource.ts` | Uses proxy routes; query format unchanged in Neo4j 5.x |
| `src/Utils.ts` | Response parsing logic compatible with Neo4j 5.x response format |
| `src/QueryEditor.tsx` | Cypher syntax largely backward compatible |

#### 2.7.6 package.json - Version Bump (Optional)

**File**: `package.json`

```json
{
  "name": "cts-neo-4-j-4-0",
  "version": "2.0.0",  // Bump version for major Neo4j change
}
```

#### 2.7.7 Rebuild Plugin

After making source changes, rebuild the plugin:
```bash
cd PlatformGrafanaPlugins/DataSources/neo4j-4
npm install
npm run build
```

This regenerates `dist/module.js` that Grafana loads.

#### 2.7.8 Grafana Plugin Changes Summary

| File | Change Type | Priority |
|------|-------------|----------|
| `src/ConfigEditor.tsx:126` | Update default URL | **Critical** |
| `src/types.ts` | Add `databaseName` field | Recommended |
| `src/ConfigEditor.tsx` | Add database name input | Recommended |
| `src/plugin.json` | Update name/description | Optional |
| `package.json` | Bump version | Optional |
| `src/DataSource.ts` | No changes needed | ✓ |
| `src/Utils.ts` | No changes needed | ✓ |
| `src/QueryEditor.tsx` | No changes needed | ✓ |

#### 2.7.9 Existing Datasource Migration in Grafana

For users with existing Neo4j 4.x datasources configured in Grafana:

1. Navigate to **Configuration → Data Sources → Neo4j**
2. Update the **URL** field from:
   - `http://neo4j-host:7474/db/data/transaction/commit`
   - to: `http://neo4j-host:7474/db/neo4j/tx/commit`
3. Click **Save & Test** to verify connectivity

### 2.8 Configuration Files
**File**: `PlatformService/src/main/resources/server-config-template.json`

Update graph configuration:
```json
"graph": {
  "endpoint": "http://localhost:7474",
  "authToken": "",
  "boltEndPoint": "bolt://localhost:7687",
  "maxIdleConnections": 25,
  "logQueryIfProcessingTimeGreaterThanInMS": 5,
  "version": "5.26",
  "databaseName": "neo4j"
}
```

---

## Phase 3: APOC Migration (Community Edition)

### 3.1 APOC Procedures Used
| Procedure | Location | 5.x Community Status |
|-----------|----------|----------------------|
| `apoc.monitor.store()` | HealthUtil.java:366 | APOC Core - Compatible |
| `apoc.trigger.add()` | triggerStatements.json | APOC Core - Requires config |
| `apoc.create.uuid()` | triggerStatements.json | APOC Core - Compatible |
| `apoc.date.format()` | Report templates (10+ files) | APOC Core - Compatible |

### 3.2 APOC Installation for Community 5.26
```bash
# Download APOC Core 5.26.x (must match Neo4j version)
# From: https://github.com/neo4j/apoc/releases

# Copy to Neo4j plugins directory
cp apoc-core-5.26.0-core.jar /path/to/neo4j/plugins/
```

### 3.3 APOC Configuration Changes
**Neo4j 5.x**: APOC settings must be in `apoc.conf`, not `neo4j.conf`

Create `/path/to/neo4j/conf/apoc.conf`:
```properties
# Enable triggers (required for apoc.trigger.add)
apoc.trigger.enabled=true

# Allow unrestricted procedures
apoc.import.file.enabled=true
```

Update `neo4j.conf`:
```properties
# Allow APOC procedures
dbms.security.procedures.unrestricted=apoc.*
dbms.security.procedures.allowlist=apoc.*
```

Update deployment scripts:
- `PlatformDeployment/UBUNTU/insights_neo4j.sh`
- `PlatformDeployment/RHEL7/reference-DocRoot-Scripts/insights_neo4j.sh`
- `PlatformDeployment/RHEL8/reference-DocRoot-Scripts/insights_neo4j.sh`

---

## Phase 4: Database Migration Steps (Community Edition)

### 4.1 Preparation (Neo4j 4.4 Community)
```bash
# 1. Stop Neo4j 4.4
neo4j stop

# 2. Create dump (Community uses single database "neo4j")
neo4j-admin dump --database=neo4j --to=/backup/neo4j-4.4-backup.dump

# 3. Export index/constraint definitions for reference
cypher-shell -u neo4j -p <password> "SHOW INDEXES" > indexes_backup.txt
cypher-shell -u neo4j -p <password> "SHOW CONSTRAINTS" > constraints_backup.txt
```

### 4.2 Migration Execution (Community Edition)
```bash
# 1. Install Neo4j 5.26 Community (separate directory recommended)
# Download from: https://neo4j.com/download-center/#community

# 2. Stop Neo4j 5.26 if running
neo4j stop

# 3. Load the dump into Neo4j 5.26
neo4j-admin database load --from-path=/backup/neo4j-4.4-backup.dump neo4j --overwrite-destination=true

# 4. Migrate the database format
neo4j-admin database migrate neo4j

# 5. Start Neo4j 5.26
neo4j start
```

**Note**: Community Edition only supports a single database named "neo4j". The `databaseName` config should always be "neo4j".

### 4.3 Post-Migration Validation
```cypher
-- Verify node counts
MATCH (n) RETURN count(n)

-- Verify relationship counts
MATCH ()-[r]->() RETURN count(r)

-- Check indexes migrated
SHOW INDEXES

-- Check constraints migrated
SHOW CONSTRAINTS
```

---

## Phase 5: Testing Strategy

### 5.1 Unit Tests
- Run existing PlatformDAL tests
- Run PlatformEngine tests
- Verify GraphDBHandler operations

### 5.2 Integration Tests
- Test all Cypher queries in report templates
- Verify APOC procedure compatibility
- Test Grafana datasource connectivity

### 5.3 Regression Tests
- Execute PlatformRegressionTest suite
- Verify all endpoints work correctly

---

## Phase 6: Deployment Checklist

- [ ] Backup Neo4j 4.4 database
- [ ] Deploy code changes to application
- [ ] Install Neo4j 5.26
- [ ] Install APOC Core 5.x
- [ ] Configure apoc.conf
- [ ] Migrate database
- [ ] Validate data integrity
- [ ] Run integration tests
- [ ] Update Grafana plugins
- [ ] Update deployment scripts

---

## Files to Modify (Summary)

### Backend Java Files
| File | Type of Change | Priority |
|------|----------------|----------|
| `PlatformCommons/.../GraphDBHandler.java` | API endpoint + version logic + schema methods | **Critical** |
| `PlatformCommons/.../GraphData.java` | Default version | **Critical** |
| `PlatformDAL/.../HealthUtil.java` | Endpoint + APOC validation | High |
| `PlatformService/.../BusinessMappingServiceImpl.java` | Version check | High |
| `PlatformService/.../GrafanaUtilities.java` | Datasource URL | High |
| `PlatformService/.../server-config-template.json` | Version config | High |
| `PlatformEngine/.../EngineTestData.java` | Version check | High |

### Python Agent Files
| File | Type of Change | Priority |
|------|----------------|----------|
| `PlatformAgents/.../Neo4jArchivalAgent.py` | db.indexes → SHOW INDEXES | High |

### Grafana Plugin Files
| File | Type of Change | Priority |
|------|----------------|----------|
| `PlatformGrafanaPlugins/DataSources/neo4j-4/src/ConfigEditor.tsx` | Default URL update (line 126) | **Critical** |
| `PlatformGrafanaPlugins/DataSources/neo4j-4/src/types.ts` | Add databaseName field | Recommended |
| `PlatformGrafanaPlugins/DataSources/neo4j-4/src/plugin.json` | Update name/description | Optional |
| `PlatformGrafanaPlugins/DataSources/neo4j-4/package.json` | Version bump | Optional |
| `PlatformGrafanaPlugins/DataSources/neo4j-4/dist/module.js` | Rebuild after source changes | **Critical** |

### Deployment Scripts
| File | Type of Change | Priority |
|------|----------------|----------|
| `PlatformDeployment/UBUNTU/insights_neo4j.sh` | APOC config location | High |
| `PlatformDeployment/RHEL7/reference-DocRoot-Scripts/insights_neo4j.sh` | APOC config location | High |
| `PlatformDeployment/RHEL8/reference-DocRoot-Scripts/insights_neo4j.sh` | APOC config location | High |

---

## Rollback Plan

1. Keep Neo4j 4.4 instance running in read-only mode during migration
2. Maintain backup of Neo4j 4.4 database
3. Keep original code on a separate branch
4. If rollback needed: restore 4.4 database and redeploy previous code version

---

## Timeline Considerations

- Neo4j 4.4 LTS support ends **November 2025**
- Neo4j 5.26 LTS supported until **November 2028**
- Migration requires **downtime** (no live migration path)

---

## Sources
- [Neo4j 5 Upgrade Guide](https://neo4j.com/docs/upgrade-migration-guide/current/version-5/)
- [Breaking Changes 4.4 to 5.x](https://neo4j.com/docs/upgrade-migration-guide/current/version-5/migration/breaking-changes/)
- [Migrate from 4.4 LTS](https://neo4j.com/docs/upgrade-migration-guide/current/version-5/migration/)
- [APOC Migration Guide](https://neo4j.com/docs/apoc/current/migration-guide/)
