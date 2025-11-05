#!/bin/bash
prisma generate --generator python_client
gunicorn --workers 1 --threads 100 --bind 0.0.0.0:4000 --reload src.server:app
