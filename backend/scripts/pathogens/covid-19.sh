#!/bin/bash

# run nextclade
nextclade run $1 --output-json $2 --input-dataset datasets/nextclade_covid
