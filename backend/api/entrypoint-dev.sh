#!/bin/bash
rm -rf /api/logs
mkdir -p /api/logs
prisma generate --generator py_client
gunicorn --workers 1 --threads 100 --bind 0.0.0.0:4000 --reload api.server:app
