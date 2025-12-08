# Testing

This chapter describes the testing strategy, setup, and execution for the GENTRAIN project. We employ multiple testing layers to ensure code quality and system reliability: unit tests, end-to-end (E2E) tests, and a production-like testing environment.

## Testing Strategy

GENTRAIN follows a multi-layered testing approach:

1. **Unit Tests**: Test individual components and functions in isolation
2. **End-to-End (E2E) Tests**: Validate complete user workflows in a production-like environment

## Test Environment Setup

### Docker Compose for Testing

We use Docker Compose and a Caddyfile.local file to simulate the production environment locally. This ensures tests run against realistic conditions with all required services.

#### Services

The test environment (`docker-compose.test.yaml`) extends the main `docker-compose.prod.yaml` with additional configurations for testing:

- **e2e-tests:**: Cypress test runner
- **frontend-tests**: Frontend service with test configurations

These services are using a testing profile to isolate them from production services.

#### Starting the Test Environment

```bash
docker compose -f docker-compose.test.yaml build --no-cache
docker compose -f docker-compose.test.yaml --profile testing build e2e-tests frontend-tests
```

This commands build the necessary Docker images for the test environment.

```bash
docker compose -f docker-compose.test.yaml up
```

This command starts all services defined in the test Docker Compose file. After starting the services, you can reach the services under following domains:

- API at `http://api.localhost`
- Frontend at `https://app.localhost`
- Admin-Panel at `https://admin.localhost`
- Docs at `https://docs.localhost`

More details about the routing can be found in the `Caddyfile.local`.

#### Stopping the Test Environment

```bash
docker compose -f docker-compose.test.yaml down
```

### Environment Configuration

The `.env.test` file contains test-specific configuration and is used by the test services and the CI/CD pipeline.

## Unit Testing

### Frontend Unit Tests

Frontend unit tests are located in the `frontend/` directory and use Vitest as the testing framework.

#### Running Frontend Unit Tests

```bash
# From ./frontend
npm run test
```

### API Unit Tests

API unit tests are located in the `backend/api/` directory and use pytest as the testing-framework.

#### Running API Unit Tests locally

```bash
# From ./backend/api
pytest
```

#### Running API Unit Tests in Docker

```bash
docker exec gentrain-api sh -c "pytest"
```

## End-to-End (E2E) Testing with Cypress

### Overview

Cypress is used for E2E testing to validate complete user workflows from the UI perspective. Tests run in a real browser (chrome) against a live test environment.

### Cypress Setup

The E2E test suite is located in `e2e-tests/cypress/` with the following structure:

```
cypress/
├── e2e/            # Test specifications
│   └── smoke/      # Smoke tests for critical workflows
│   └── admin/      # Admin panel tests
│   └── app/        # Frontend tests
│   └── docs/       # Documentation tests
├── fixtures/       # Test data files
├── support/        # Helper functions and utilities
└── screenshots/    # Screenshots from test runs
└── videos/         # Video recordings of test runs
```

### Running E2E Tests

#### Prerequisites

Start the test environment like described in the [Test Environment Setup](#test-environment-setup) section.

#### Running Tests

**Interactive Mode** (for development):

```bash
cd e2e-tests
npx cypress open
```

This opens the Cypress Test Runner where you can:

- View and debug individual tests
- Run tests in specific browsers
- View test video recordings
- Inspect element selectors

**Headless Mode**:

```bash
cd e2e-tests
npx cypress run
```

This executes all tests in a headless browser and generates a test report.

**In Docker** (for CI/CD):

```bash
docker compose -f docker-compose.test.yaml --profile testing run --rm e2e-tests
```

## Automated Testing with GitHub Actions

### CI/CD Workflow

The `.github/workflows/testing.yml` file defines automated testing on:

- **Push to dev branch**: Full test suite execution
- **Pull requests dev branch**: Test validation before merge

### Workflow Stages

1. **Setup**: Check out code and prepare environment
2. **Build Docker Images**: Build all Docker images including test services
3. **Start Services**: Launch test environment via Docker Compose
4. **Wait for Services**: Health checks ensure all services are ready before testing
5. **Run Unit Tests**: Execute frontend and API unit tests
6. **Run E2E Tests**: Execute Cypress end-to-end tests
7. **Upload Artifacts**: Save test videos and screenshots for debugging
8. **Cleanup**: Tear down test environment and remove containers

The workflow includes comprehensive error handling:

- Container logs are captured on failure for debugging
- Test artifacts (videos/screenshots) are uploaded in GitHub Artifacts regardless of test results
- Services are always shut down, even if tests fail
