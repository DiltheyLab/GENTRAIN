#!/bin/bash
chown gentrain:gentrain -R pathogen_schemes
prisma generate --generator py_client
gunicorn --chdir / --workers 1 --threads 100 --bind :8080 api.server:app