#!/bin/bash
rm -rf logs
mkdir -p logs
prisma generate --generator py_client
gunicorn --workers 1 --threads 100 --bind 0.0.0.0:4000 --reload src.server:app
