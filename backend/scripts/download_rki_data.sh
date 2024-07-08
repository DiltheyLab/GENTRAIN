#!/bin/bash

mkdir /app/datasets/RKI
cd /app/datasets/RKI
wget https://github.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland/blob/main/SARS-CoV-2-Sequenzdaten_Deutschland.fasta.xz
unxz SARS-CoV-2-Sequenzdaten_Deutschland.fasta.xz
samtools faidx SARS-CoV-2-Sequenzdaten_Deutschland.fasta