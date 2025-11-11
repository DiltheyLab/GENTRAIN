#!/bin/sh
set -e

npx prisma generate --generator js_client
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
    npx prisma db seed
fi

supervisord -c /admin/supervisor.conf -n