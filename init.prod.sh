#!/bin/sh

# Set nobody:nogroup as owner for caddy volumes
chown -R 65534:65534 /data /config /certs
# Create gentrain user and gentrain group and set gentrain:gentrain as owner for the api_data-volume
# To grant permission when writing to the volume from inside the admin container
addgroup -g 1010 gentrain
adduser -D -G gentrain -u 1010 gentrain
chown gentrain:gentrain -R /api_data
sh /prisma/init.sh

exit 0