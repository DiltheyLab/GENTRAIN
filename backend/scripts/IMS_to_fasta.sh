#!/bin/bash

# activate conda environment
source /home/ubuntu/miniconda3/bin/activate num-dash

# run samtools to collect sequences
samtools faidx $5/SARS-CoV-2-Sequenzdaten_Deutschland.fasta $1 > $2


# filter lines from csv by ims id
grep -E  $3 $5/SARS-CoV-2-Sequenzdaten_Deutschland.csv > $4
