#!/bin/bash
mkdir -p /backend/logs
nextclade dataset get --name 'sars-cov-2' --output-dir '/backend/datasets/nextclade_covid/'
supervisord -c /backend/supervisor_dev.conf