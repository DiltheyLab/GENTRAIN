#!/bin/sh
npx prisma generate --generator js_client
npx prisma migrate deploy
supervisord -c /admin/supervisor.conf -n