# Migration Plan: Java 21 + Spring Boot 3.5.4 + Spring Security 6.5.3

## Current State Analysis
- **Current Java**: 11
- **Current Spring Boot**: 2.7.18
- **Current Spring Security**: 5.8.11
- **Jakarta imports found**: 501 occurrences across 124 files (major migration effort)
- **Multi-module Maven project**: 10 modules with complex dependencies

## Phase-Based Migration Strategy

### **Phase 1: Environment & Build Setup (Week 1)**

#### 1.1 Update Parent POM
```xml
<!-- /pom.xml -->
<properties>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>
    <springframework.boot.version>3.5.4</springframework.boot.version>
    <spring.version>6.2.1</spring.version>
    <spring.security.version>6.5.3</spring.security.version>
    <jakarta.persistence.version>3.1.0</jakarta.persistence.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>${springframework.boot.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

#### 1.2 Update Maven Plugins
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.13.0</version>
    <configuration>
        <source>21</source>
        <target>21</target>
        <release>21</release>
        <parameters>true</parameters>
    </configuration>
</plugin>
```

### **Phase 2: Jakarta EE Migration (Week 2-3)**

#### 2.1 Automated Migration Using OpenRewrite
```bash
# Add OpenRewrite plugin to parent POM
mvn org.openrewrite.maven:rewrite-maven-plugin:run \
    -Drewrite.recipeArtifactCoordinates=org.openrewrite.recipe:rewrite-migrate-java:RELEASE \
    -Drewrite.activeRecipes=org.openrewrite.java.migrate.jakarta.JavaxMigrationToJakarta
```

#### 2.2 Critical Files to Update (501 javax imports identified):

**High Priority Files:**
- `PlatformDAL/**/*.java` - All JPA entities (25+ files)
- `PlatformService/src/main/java/**/security/**/*.java` - Security filters and config
- `PlatformCommons/src/main/java/**/mq/**/*.java` - Message queue handlers
- `PlatformWorkflow/src/main/java/**/email/*.java` - Email processing

**Common Pattern Updates:**
```java
// JPA Entities
javax.persistence.* → jakarta.persistence.*

// Servlet API
javax.servlet.* → jakarta.servlet.*

// Mail API
javax.mail.* → jakarta.mail.*
javax.activation.* → jakarta.activation.*

// Annotations
javax.annotation.* → jakarta.annotation.*
```

### **Phase 3: Spring Boot 3.5.4 Migration (Week 4-5)**

#### 3.1 Update PlatformService Dependencies
```xml
<!-- Remove explicit version numbers (inherited from BOM) -->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <!-- Remove spring-boot-starter-logging exclusion - no longer needed -->
    </dependency>

    <!-- Add Jakarta dependencies -->
    <dependency>
        <groupId>jakarta.persistence</groupId>
        <artifactId>jakarta.persistence-api</artifactId>
    </dependency>

    <dependency>
        <groupId>jakarta.mail</groupId>
        <artifactId>jakarta.mail-api</artifactId>
    </dependency>
</dependencies>
```

#### 3.2 Configuration Updates
```properties
# application.properties
spring.mvc.pathmatch.matching-strategy=path_pattern_parser
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
logging.level.org.springframework.security=DEBUG
```

#### 3.3 Update Third-party Dependencies
```xml
<!-- Jersey 2.28 → 3.x -->
<dependency>
    <groupId>org.glassfish.jersey.core</groupId>
    <artifactId>jersey-server</artifactId>
    <version>3.1.5</version>
</dependency>

<!-- Hibernate 5.x → 6.x -->
<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-core</artifactId>
    <version>6.4.4.Final</version>
</dependency>
```

### **Phase 4: Spring Security 6.5.3 Migration (Week 6)**

#### 4.1 Security Configuration Updates
**Key files to update:**
- `PlatformService/src/main/java/com/cognizant/devops/platformservice/security/config/grafana/InsightsSecurityConfigurationAdapter.java`
- All security filter classes with `javax.servlet` imports

```java
// Replace .antMatchers() with .requestMatchers()
http.authorizeHttpRequests(authz -> authz
    .requestMatchers(new AntPathRequestMatcher("/PlatformService/admin/**")).hasAuthority("Admin")
    .requestMatchers(new AntPathRequestMatcher("/PlatformService/insights/**")).hasAnyAuthority("Admin", "Editor", "Viewer")
    .anyRequest().authenticated()
);

// Update CORS configuration
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList("*"));
    configuration.setAllowedMethods(Arrays.asList("*"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

#### 4.2 Filter Updates
All servlet filters need `jakarta.servlet.*` imports:
- `InsightsAuthenticationFilter.java`
- `InsightsExternalAPIAuthenticationFilter.java`
- `RequestWrapper.java`
- `InsightsResponseHeaderWriterFilter.java`

### **Phase 5: Testing & Validation (Week 7-8)**

#### 5.1 Update Test Dependencies
```xml
<!-- Update JUnit 4 → 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<!-- Remove JUnit 4 -->
<!-- <artifactId>junit</artifactId> -->
```

#### 5.2 Test Migration Commands
```bash
# Run tests per module
mvn test -pl PlatformCommons
mvn test -pl PlatformDAL
mvn test -pl PlatformService
mvn test -pl PlatformEngine
# etc.

# Full integration test
mvn clean test -P integration-tests
```

#### 5.3 Angular Frontend Compatibility
```bash
cd PlatformUI4
# No changes needed - Angular 13 compatible with Java 21 backend
npm test
npm run build
```

### **Phase 6: Performance & Optimization (Week 9)**

#### 6.1 Java 21 Features Integration
- **Virtual Threads**: Update high-concurrency modules (PlatformEngine, PlatformWorkflow)
- **Pattern Matching**: Refactor switch statements in business logic
- **GC Optimization**: Configure ZGC for better performance

#### 6.2 Spring Boot 3 Native Compilation (Optional)
```xml
<plugin>
    <groupId>org.graalvm.buildtools</groupId>
    <artifactId>native-maven-plugin</artifactId>
</plugin>
```

## Risk Assessment & Mitigation

### **High Risk Items:**
1. **501 javax imports** across 124 files - Use automated tools
2. **Security configuration changes** - Thorough testing required
3. **JPA/Hibernate migration** - Database compatibility testing
4. **Message queue integration** - AWS/messaging system validation

### **Mitigation Strategies:**
- **Branch Strategy**: Create `migration/java21-spring3` branch
- **Module-by-Module**: Migrate one module at a time
- **Automated Testing**: Maintain existing test coverage
- **Rollback Plan**: Keep Java 11/Spring Boot 2.7 version ready

## Timeline Summary
- **Total Duration**: 9 weeks
- **Critical Path**: Jakarta EE migration (Weeks 2-3)
- **Parallel Work**: Frontend remains unchanged
- **Go-Live**: Week 10 (with 1 week buffer)

## Success Criteria
- [ ] All 501 javax imports migrated to jakarta
- [ ] All tests passing (current: ~90% coverage)
- [ ] Security authentication/authorization working
- [ ] Performance baseline maintained/improved
- [ ] All deployment environments validated

## Module-Specific Migration Notes

### PlatformCommons
- **Priority**: High (foundation for all modules)
- **Key Changes**: Message queue handlers, utility classes
- **Dependencies**: Base utilities, AWS integration

### PlatformDAL
- **Priority**: Critical (database layer)
- **Key Changes**: All JPA entities, Hibernate configuration
- **Files**: 25+ entity files with JPA annotations

### PlatformService
- **Priority**: Critical (main application)
- **Key Changes**: Security configuration, REST controllers
- **Dependencies**: Spring Boot, Spring Security, Jersey

### PlatformEngine
- **Priority**: High (core processing)
- **Key Changes**: Message processing, data correlation
- **Performance Impact**: Consider virtual threads

### PlatformWorkflow
- **Priority**: Medium (workflow management)
- **Key Changes**: Email processing, task scheduling
- **Dependencies**: Mail API migration critical

### PlatformUI4
- **Priority**: Low (Angular frontend)
- **Key Changes**: None required
- **Validation**: Ensure API compatibility

### Other Modules
- **PlatformReports**: Medium priority, email functionality
- **PlatformInsightsWebHook**: Medium priority, servlet filters
- **PlatformRegressionTest**: Low priority, test updates
- **PlatformTestReport**: Low priority, reporting features

## Migration Commands Quick Reference

```bash
# Phase 1: Build setup
mvn clean compile -DskipTests

# Phase 2: Jakarta migration
mvn org.openrewrite.maven:rewrite-maven-plugin:run \
    -Drewrite.activeRecipes=org.openrewrite.java.migrate.jakarta.JavaxMigrationToJakarta

# Phase 3-4: Spring migration
mvn clean compile
mvn dependency:resolve

# Phase 5: Testing
mvn clean test
mvn clean package

# Phase 6: Full build
mvn clean install
```

## Post-Migration Validation Checklist

- [ ] Application starts without errors
- [ ] All REST endpoints accessible
- [ ] Authentication/authorization working
- [ ] Database connections established
- [ ] Message queue integration functional
- [ ] Email notifications working
- [ ] Grafana integration operational
- [ ] Agent management functional
- [ ] Report generation working
- [ ] Performance benchmarks met
- [ ] Security scans passed
- [ ] Documentation updated