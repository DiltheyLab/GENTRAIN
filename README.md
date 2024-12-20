# GenTrain Dashboard

_About the Project_

## Installation

## Deployment

GenTrain is currently deployed using Docker and Docker Compose on the de.NBI Cloud. The deployment process is automated through a CI/CD pipeline using GitHub Actions.

### CI/CD Pipeline

The project uses a GitHub Actions workflow for continuous integration and deployment. The workflow is triggered on:

- Pull requests to the `prod` branch
- Pushes to the `prod` branch
- Manual trigger (workflow_dispatch)

The CI/CD pipeline consists of the following steps:

1. **Frontend Build**: Builds the frontend application.
2. **Pull Production State**: Updates the production server with the latest code.
3. **Restart Docker Containers**: Regenerates environment variables and restarts the Docker containers.

### GitHub Actions Variables and Secrets

To ensure proper functionality of the CI/CD pipeline, the following GitHub Actions variables and secrets need to be set up:

#### Variables:

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

#### Secrets:

- `SSH_PRIVATE_KEY`: The SSH private key for accessing the deployment server
- `HTBASIC_PASSWORD`: The password for HTTP basic authentication
- `RQ_SECRET`: The secret key for Redis Queue
- `GENTRAIN_PASSWORD`: The sudo password for the deployment server

Make sure to set these variables and secrets in your GitHub repository settings under "Settings" > "Secrets and variables" > "Actions" before running the deployment workflow.

### Automatic Deployment

When changes are pushed to the `prod` branch, the following process occurs automatically:

1. The GitHub Actions workflow is triggered.
2. The frontend is built and tested.
3. The latest code is pulled to the production server on the de.NBI Cloud.
4. Environment variables are regenerated on the server.
5. Docker containers are stopped, rebuilt without using cache, and restarted.

This ensures that the production environment is always running the latest version of the application with minimal downtime.

### Manual Deployment

While the deployment process is automated, it can also be triggered manually through the GitHub Actions interface if needed.

### Deployment Infrastructure

- **Hosting**: de.NBI Cloud
- **Containerization**: Docker and Docker Compose
- **CI/CD**: GitHub Actions

### Services

The deployment includes the following services:

- **Caddy**: Reverse proxy and web server
- **Redis**: In-memory data structure store
- **Backend**: Python-based backend service
- **Worker**: Background task processor
- **Frontend**: Node.js-based frontend service
- **Redis Insight**: GUI for Redis monitoring and management

### Environment Variables

Environment variables for both frontend and backend are securely managed through GitHub Secrets and Variables, and are automatically set during the deployment process.

### Accessing the Application

After successful deployment:

- The frontend is accessible via HTTPS (port 443)
- The backend API is available on port 4000
- Redis Insight can be accessed on port 5540

### Monitoring

Deployment status notifications are sent to a Slack channel, providing real-time updates on the success or failure of each deployment step.

For more detailed information about the deployment process, refer to the `.github/workflows/prod_deployment.yml` file in the repository.

## Testing

GenTrain employs a comprehensive testing strategy that includes a dedicated testing environment in the de.NBI cloud. This setup allows for thorough testing of new features and changes before they are deployed to the production environment.

### Testing Environment

- A separate instance in the de.NBI cloud runs all Docker containers for testing purposes.
- This testing instance is a copy of the production setup but is isolated for safety and stability.

### Port Forwarding Configuration

To facilitate testing while maintaining security, we use a port forwarding mechanism from the main production instance to the testing instance. This setup allows us to access the testing environment through specific ports on the production server and save floating IP-Adresses.

#### Port Forwarding Script

A custom script is run on the main production instance to configure iptables and enable port forwarding. This script performs the following tasks:

1. Enables IP forwarding
2. Sets up port mapping rules:
3. Overrides Docker's default FORWARD policy to ACCEPT

```
#!/bin/bash
function check_service {
  /bin/nc -z ${1} ${2} 2>/dev/null
  while test $? -eq 1; do
    echo "wait 10s for service available at ${1}:${2}"
    sleep 10
    /bin/nc -z ${1} ${2}  2>/dev/null
  done
}

# redirect ouput to /var/log/userdata/log
exec > /var/log/userdata.log
exec 2>&1

# wait until meta data server is available
check_service 169.254.169.254 80

# get local ip from meta data server
LOCALIP=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
LOCALNET=$( echo ${LOCALIP} | cut -f 1-3 -d".")

#enable ip forwarding
echo "1" > /proc/sys/net/ipv4/ip_forward

# Map port number to local ip-address
# 30000+x -> LOCALNET.0+x:22
# 31000+x -> LOCALNET.0+x:80
# 32000+x -> LOCALNET.0+x:443
# x > 0 and x < 255

#ip forwarding rules
for ((n=1; n <=254; n++))
        {
        SSH_PORT=$((30000+$n))
        HTTP_PORT=$((31000+$n))
        HTTPS_PORT=$((32000+$n))

        iptables -t nat -A PREROUTING -i ens3 -p tcp -m tcp --dport ${SSH_PORT} -j DNAT --to-destination ${LOCALNET}.${n}:22
        iptables -t nat -A POSTROUTING -d ${LOCALNET}.${n}/32 -p tcp -m tcp --dport 22 -j SNAT --to-source ${LOCALIP}

        iptables -t nat -A PREROUTING -i ens3 -p tcp -m tcp --dport ${HTTP_PORT} -j DNAT --to-destination ${LOCALNET}.${n}:80
        iptables -t nat -A POSTROUTING -d ${LOCALNET}.${n}/32 -p tcp -m tcp --dport 80 -j SNAT --to-source ${LOCALIP}

        iptables -t nat -A PREROUTING -i ens3 -p tcp -m tcp --dport ${HTTPS_PORT} -j DNAT --to-destination ${LOCALNET}.${n}:443
        iptables -t nat -A POSTROUTING -d ${LOCALNET}.${n}/32 -p tcp -m tcp --dport 443 -j SNAT --to-source ${LOCALIP}
        }

# Override Dockers FORWARD Policy and set it back to default
iptables -P FORWARD ACCEPT
```

The script ensures that the testing environment is accessible through specific ports while maintaining isolation from the production environment.
The setup of the test instance in de.NBI Cloud follows this tutorial: `https://cloud.denbi.de/wiki/Tutorials/SaveFloatingIPs/`

### SSL Configuration for Test Server

To ensure a secure, SSL-encrypted connection to the test server with a valid certificate, follow these steps:

1. The production instance automatically generates SSL certificates using Caddy.
2. These certificates are stored in specific folders on the production server.
3. To use these certificates for the test server:
   - Copy the certificate files (.crt and .key) from the production instance to the corresponding folders on the test instance.
   - The paths for these certificates are defined in the Caddyfile. We have created an example file (`Caddyfile.test.example`) where you can see the structure:
     - For the API: `/data/caddy/certificates/api.gentrain.bi.denbi.de/api.gentrain.bi.denbi.de.crt` and `.key`
     - For the frontend: `/data/caddy/certificates/gentrain.bi.denbi.de/gentrain.bi.denbi.de.crt` and `.key`

By copying these certificates, you ensure that the test server uses the same valid SSL certificates as the production server, allowing for secure, encrypted connections during testing.

> Note: Remember to update these certificates periodically to maintain security and prevent expiration issues.

### GitHub Actions Variables and Secrets for Testing

In addition to the variables and secrets required for deployment, the testing pipeline needs some extra configuration. Make sure to add these to your GitHub repository settings under "Settings" > "Secrets and variables" > "Actions":

#### Additional Variables:

- `SSH_PORT_TEST_SERVER`: The SSH port for the test server
- `HTTPS_PORT_TEST_SERVER`: The HTTPS port for the test server
- `TESTING_BRANCH`: The branch name for testing deployments (e.g., "test")

#### Additional Secrets:

- `SSH_PRIVATE_KEY_TEST_SERVER`: The SSH private key for accessing the test server
- `GENTRAIN_PASSWORD_TEST_SERVER`: The sudo password for the test server

These additional variables and secrets are used in the `.github/workflows/test_deployment.yml` file to manage the test environment deployment.

### Automated Testing Workflow

1. **Trigger**: The testing workflow is triggered by pushes to the `test` branch or manually through GitHub Actions.

2. **Frontend Build and Test**:

   - The frontend is built and unit tests are run.
   - Test coverage reports are generated.

3. **Deployment to Testing Environment**:

   - The latest code is pulled to the testing server.
   - Environment variables are updated.
   - Docker containers are rebuilt and restarted.

4. **Monitoring**:
   - Slack notifications are sent for both successful deployments and failures.

### Accessing the Testing Environment

The testing environment can be accessed through the designated ports on the production server. This allows developers and testers to interact with the testing instance as if it were a separate deployment.

For more details on the testing workflow, refer to the `.github/workflows/test_deployment.yml` file in the repository.

## Architecture

## Communication

## Data Persistence

### IndexedDB

### Redis

## Domain Modules

## Sample Upload

![Sample Upload](doc/images/sample_upload.png)

### Sequence Analysis

![Viral Sequence Analysis](doc/images/viral_sequence_analysis.png)

![Bacterial Sequence Analysis](doc/images/bacterial_sequence_analysis.png)

### Distance Calculation

### Distance Matrix Assembling

_Made with :orange_heart: in Düsseldorf by Dilthey Lab_
