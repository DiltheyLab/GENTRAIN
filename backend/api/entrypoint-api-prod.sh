#!/bin/bash
prisma generate --generator py_client
gunicorn --chdir / --workers 1 --threads 100 --bind :8080 api.server:app