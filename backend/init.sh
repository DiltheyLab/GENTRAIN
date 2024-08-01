#!/bin/bash

nextclade dataset get --name 'sars-cov-2' --output-dir '/backend/datasets/nextclade_covid/'
flask run --host=0.0.0.0 -p 4000