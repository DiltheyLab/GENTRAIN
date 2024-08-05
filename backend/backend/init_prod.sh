#!/bin/bash

nextclade dataset get --name 'sars-cov-2' --output-dir '/backend/datasets/nextclade_covid/'
uwsgi --ini uwsgi.ini