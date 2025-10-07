#!/bin/bash
prisma generate --generator py_client
supervisord -c /api/supervisor.conf