#!/bin/bash

# activate conda environment
source /home/ubuntu/miniconda3/bin/activate num-dash

# run nextclade
nextclade run $1 --output-json $2 --input-dataset datasets/nextclade_covid
