#!/bin/bash
source /home/ubuntu/miniconda3/bin/activate num-dash

# Define input
query_sequence=$1
k=$2
out_tmp=$3
USHERtemp_dir=$4
csvTemp=$5

# MSA against wuhan reference
mafft --thread 2 --auto --keeplength --addfragments $query_sequence ./datasets/usher/wuhan.fasta > $query_sequence.aligned

# Convert alignment fasta to VCF file
faToVcf -maskSites=./datasets/usher/problematic_sites_sarsCov2.vcf $query_sequence.aligned $query_sequence.aligned.vcf

usher -i ./datasets/usher/IMSglobal_assignments.pb -v $query_sequence.aligned.vcf -u -k $k -d $USHERtemp_dir

sed -n -e '/^IMS/p' $USHERtemp_dir"/subtree-1-mutations.txt" | cut -d':' -f1 > $out_tmp

# filter lines from csv by ims id
imsIDs=$(cut -d "|" -f 1 $out_tmp)
imsIDs2=$(echo $imsIDs | tr " " "|")

## get CSV entries
grep -E  $imsIDs2 $6/SARS-CoV-2-Sequenzdaten_Deutschland.csv > $csvTemp

## Get genomic sequences
imsIDs3=$(awk -F"," '{print $1}' $csvTemp)
imsIDs4=$(echo $imsIDs3 | tr " " " ")
samtools faidx $6/SARS-CoV-2-Sequenzdaten_Deutschland.fasta $imsIDs4 > $7
