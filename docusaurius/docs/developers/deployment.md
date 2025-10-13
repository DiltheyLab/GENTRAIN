# Deployment

GenTrain is currently deployed using Docker and Docker Compose on the de.NBI Cloud. The deployment process is automated through a CI/CD pipeline using GitHub Actions.

## CI/CD Pipeline

The project uses a GitHub Actions workflow for continuous integration and deployment. The workflow is triggered on:

- Pull requests to the `prod` branch
- Pushes to the `prod` branch
- Manual trigger (workflow_dispatch)

The CI/CD pipeline consists of the following steps:

1. **Frontend Build**: Builds the frontend application.
2. **Pull Production State**: Updates the production server with the latest code.
3. **Restart Docker Containers**: Regenerates environment variables and restarts the Docker containers.

## GitHub Actions Variables and Secrets

To ensure proper functionality of the CI/CD pipeline, the following GitHub Actions variables and secrets need to be set up:

### Variables

- `SSH_HOST`: The hostname or IP address of the deployment server
- `SSH_USER`: The username for SSH access to the deployment server
- `GENTRAIN_DIR`: The path to your project directory on the server
- `PRODUCTION_BRANCH`: The branch name for production deployments (e.g., "prod")
- `HTBASIC_USERNAME`: The username for HTTP basic authentication
- `API_HOST`: The URL of your API (e.g., https://api.yourdomain.com)
- `APP_ENV`: The runtime environment (e.g., "production")
- `FLASK_PYDANTIC_VALIDATION_ERROR_STATUS_CODE`: The HTTP status code for Pydantic validation errors (e.g., 422)
- `REDIS_URL`: The URL for the Redis connection
- `SLACK_WEBHOOK_URL`: The Slack webhook URL for notifications

### Secrets

- `SSH_PRIVATE_KEY`: The SSH private key for accessing the deployment server
- `HTBASIC_PASSWORD`: The password for HTTP basic authentication
- `RQ_SECRET`: The secret key for Redis Queue
- `GENTRAIN_PASSWORD`: The sudo password for the deployment server

Make sure to set these variables and secrets in your GitHub repository settings under "Settings" > "Secrets and variables" > "Actions" before running the deployment workflow.

## Automatic Deployment

When changes are pushed to the `prod` branch, the following process occurs automatically:

1. The GitHub Actions workflow is triggered.
2. The frontend is built and tested.
3. The latest code is pulled to the production server on the de.NBI Cloud.
4. Environment variables are regenerated on the server.
5. Docker containers are stopped, rebuilt without using cache, and restarted.

This ensures that the production environment is always running the latest version of the application with minimal downtime.

## Manual Deployment

While the deployment process is automated, it can also be triggered manually through the GitHub Actions interface if needed.

## Deployment Infrastructure

- **Hosting**: de.NBI Cloud
- **Containerization**: Docker and Docker Compose
- **CI/CD**: GitHub Actions

## Services

The deployment includes the following services:

- **Caddy**: Reverse proxy and web server
- **Redis**: In-memory data structure store
- **API**: Python-based api service
- **Worker**: Background task processor
- **Frontend**: Node.js-based frontend service
- **Redis Insight**: GUI for Redis monitoring and management

## Accessing the Application

After successful deployment:

- The frontend is accessible via HTTPS (port 443)
- The backend API is available on port 4000
- Redis Insight can be accessed on port 5540

## Monitoring

Deployment status notifications are sent to a Slack channel, providing real-time updates on the success or failure of each deployment step.

For more detailed information about the deployment process, refer to the `.github/workflows/prod_deployment.yml` file in the repository.
