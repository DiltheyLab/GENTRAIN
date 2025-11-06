#!/bin/sh
npx prisma generate --generator js_client
supervisord -c /admin/supervisor.conf -n