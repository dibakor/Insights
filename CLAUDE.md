# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cognizant® Cloud Acceleration Platform Insights (CCAP InSights) is an enterprise DevOps analytics platform that provides real-time insights and end-to-end traceability across the software delivery pipeline. The platform integrates with various DevOps tools to identify bottlenecks and measure ROI for DevOps implementations.

## Architecture

This is a multi-module Maven project with the following key components:

### Backend Components (Java/Spring Boot)
- **PlatformCommons**: Shared utilities and common functionality
- **PlatformDAL**: Data Access Layer for database operations
- **PlatformService**: REST API services and business logic
- **PlatformEngine**: Core processing engine for data correlation and analytics
- **PlatformWorkflow**: Workflow management and execution engine
- **PlatformReports**: Report generation and management
- **PlatformInsightsWebHook**: Webhook handling for external integrations

### Frontend (Angular 13)
- **PlatformUI4**: Angular-based web application located in the PlatformUI4 directory
- Uses Angular Material for UI components
- Built with TypeScript and includes testing with Jasmine/Karma

### Agents and Integration
- **PlatformAgents**: Collection of agents for integrating with various DevOps tools (CI/CD, ALM, deployment tools)
- **PlatformGrafanaPlugins**: Custom Grafana plugins for data visualization

### Testing and Deployment
- **PlatformRegressionTest**: Automated regression testing suite
- **PlatformTestReport**: Test reporting and analysis
- **PlatformDeployment**: Deployment scripts and configurations for various platforms (Docker, Kubernetes, RHEL, Ubuntu, Windows)

## Common Development Commands

### Backend (Maven)
```bash
# Build the entire project
mvn clean compile

# Run tests
mvn test

# Build with tests and code coverage
mvn clean test jacoco:report

# Package all modules
mvn clean package

# Skip tests during build
mvn clean package -DskipTests

# Run code coverage with Cobertura
mvn clean site -PRunCobertura
```

### Frontend (Angular in PlatformUI4/)
```bash
cd PlatformUI4

# Install dependencies
npm install

# Start development server
npm run start
# or
ng serve

# Build for production
npm run build
# or
ng build --configuration production --base-href=/insights/

# Run tests
npm run test
# or
ng test

# Run linting
npm run lint
# or
ng lint

# Run e2e tests
npm run e2e
# or
ng e2e
```

## Key Technologies

- **Backend**: Java 11, Spring Boot, Maven, JUnit 4
- **Frontend**: Angular 13, TypeScript, Angular Material, Bootstrap 4
- **Database**: Support for various databases via DAL abstraction
- **Integration**: REST APIs, WebHooks, various DevOps tool APIs
- **Testing**: JUnit, Jasmine, Karma, Protractor for e2e
- **Code Coverage**: JaCoCo and Cobertura
- **Build**: Maven multi-module project structure

## Development Notes

- The project uses Java 11 as the target version
- Frontend is served with base href `/insights/` in production
- The platform is designed to be tool-agnostic and works with any REST API compliant DevOps tools
- Docker and Kubernetes deployment configurations are available in PlatformDeployment
- Multiple OS deployment options supported (RHEL7/8, Ubuntu, Windows)
- Agents are provided for popular DevOps tools and can be extended for new integrations

## Module Dependencies

The modules have dependencies in this general order:
1. PlatformCommons (base utilities)
2. PlatformDAL (data access)
3. PlatformService, PlatformEngine, PlatformWorkflow (business logic)
4. PlatformReports, PlatformInsightsWebHook (higher-level features)
5. PlatformUI4 (frontend)
6. PlatformRegressionTest, PlatformTestReport (testing)