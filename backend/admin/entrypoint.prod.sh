#!/bin/sh
npx prisma generate --generator js_client
npm run prisma:deploy-migration
supervisord -c /admin/supervisor.conf -n