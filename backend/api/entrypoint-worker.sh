#!/bin/bash
mkdir -p /api/logs
prisma generate --generator py_client
supervisord -c /api/supervisor_dev.conf