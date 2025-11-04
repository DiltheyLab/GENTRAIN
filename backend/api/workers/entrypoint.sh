#!/bin/bash
rm -rf /api/logs/
mkdir -p /api/logs/
prisma generate --generator py_client
if [[ $1 == "dev" ]]; then
  supervisord -c /api/workers/supervisor/dev.conf
fi

if [[ $1 == "prod" ]]; then
  supervisord -c /api/workers/supervisor/prod.conf
fi