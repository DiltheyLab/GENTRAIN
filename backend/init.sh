#!/bin/bash

chmod +x scripts/nextclade.sh
chmod +x scripts/usher_nearest_k.sh
chmod +x scripts/IMS_to_fasta.sh
nextclade dataset get --name 'sars-cov-2' --output-dir '/app/datasets/nextclade_covid/'
cd datasets/RKI
flask run --host=0.0.0.0 -p 4000