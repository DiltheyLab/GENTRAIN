#!/bin/bash
rm -rf /backend/logs
mkdir -p /backend/logs
alembic upgrade head
gunicorn --workers 1 --threads 100 --bind 0.0.0.0:4000 --reload backend.server:app
