# Testing

GenTrain employs a comprehensive testing strategy that includes a dedicated testing environment in the de.NBI cloud.
This setup allows for thorough testing of new features and changes before they are deployed to the production
environment.

## Testing Environment

- A separate instance in the de.NBI cloud runs all Docker containers for testing purposes.
- This testing instance is a copy of the production setup but is isolated for safety and stability.

## Port Forwarding Configuration

!!! info "This section only applies when hosting in de.NBI Cloud."

To facilitate testing while maintaining security, we use a port forwarding mechanism from the main production instance
to the testing instance. This setup allows us to access the testing environment through specific ports on the production
server and save floating IP-Adresses.

### Port Forwarding Script

A custom script is run on the main production instance to configure iptables and enable port forwarding. This script
performs the following tasks:

1. Enables IP forwarding
2. Sets up port mapping rules:
3. Overrides Docker's default FORWARD policy to ACCEPT

```sh
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

The script ensures that the testing environment is accessible through specific ports while maintaining isolation from
the production environment.
The setup of the test instance in de.NBI Cloud follows this tutorial:
`https://cloud.denbi.de/wiki/Tutorials/SaveFloatingIPs/`

## SSL Configuration for Test Server

To ensure a secure, SSL-encrypted connection to the test server with a valid certificate, follow these steps:

1. The production instance automatically generates SSL certificates using Caddy.
2. These certificates are stored in specific folders on the production server.
3. To use these certificates for the test server:
   - Copy the certificate files (.crt and .key) from the production instance to the corresponding folders on the test
     instance.
   - The paths for these certificates are defined in the Caddyfile. We have created an example file (
     `Caddyfile.test.example`) where you can see the structure:
     - For the API: `/data/caddy/certificates/api.gentrain.bi.denbi.de/api.gentrain.bi.denbi.de.crt` and `.key`
     - For the frontend: `/data/caddy/certificates/gentrain.bi.denbi.de/gentrain.bi.denbi.de.crt` and `.key`

By copying these certificates, you ensure that the test server uses the same valid SSL certificates as the production
server, allowing for secure, encrypted connections during testing.

> Note: Remember to update these certificates periodically to maintain security and prevent expiration issues.

## GitHub Actions Variables and Secrets for Testing

In addition to the variables and secrets required for deployment, the testing pipeline needs some extra configuration.
Make sure to add these to your GitHub repository settings under "Settings" > "Secrets and variables" > "Actions":

### Additional Variables

- `SSH_PORT_TEST_SERVER`: The SSH port for the test server
- `HTTPS_PORT_TEST_SERVER`: The HTTPS port for the test server
- `TESTING_BRANCH`: The branch name for testing deployments (e.g., "test")

### Additional Secrets

- `SSH_PRIVATE_KEY_TEST_SERVER`: The SSH private key for accessing the test server
- `GENTRAIN_PASSWORD_TEST_SERVER`: The sudo password for the test server

These additional variables and secrets are used in the `.github/workflows/test_deployment.yml` file to manage the test
environment deployment.

## Automated Testing Workflow

**1. Trigger**:

- The testing workflow is triggered by pushes to the `test` branch or manually through GitHub Actions.

**2. Frontend Build and Test**:

- The frontend is built and unit tests are run.
- Test coverage reports are generated.

**3. Deployment to Testing Environment**

- The latest code is pulled to the testing server.
- Environment variables are updated.
- Docker containers are rebuilt and restarted.

**4. Monitoring**:

- Slack notifications are sent for both successful deployments and failures.
