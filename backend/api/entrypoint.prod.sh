#!/bin/bash
prisma generate --generator python_client
gunicorn --chdir / --workers 1 --threads 100 --bind :8080 src.server:app