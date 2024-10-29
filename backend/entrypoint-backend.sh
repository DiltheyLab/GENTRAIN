#!/bin/bash
rm -rf /backend/logs
mkdir -p /backend/logs
nextclade dataset get --name 'sars-cov-2' --output-dir '/backend/datasets/nextclade_covid/'
gunicorn --workers 1 --threads 100 --bind 0.0.0.0:4000 --reload backend.server:app
