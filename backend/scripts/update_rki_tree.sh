#!/bin/sh

# activate conda environment
eval "$(conda shell.bash hook)"
conda activate num-dash

cd /datasets/usher/
wget https://github.com/robert-koch-institut/SARS-CoV-2-Sequenzdaten_aus_Deutschland/blob/master/SARS-CoV-2-Sequenzdaten_Deutschland.fasta.xz

## rename files and download new rki sequences
rm old_RKI_seqs.fa
mv new_RKI_seqs.fa old_RKI_seqs.fa
xzcat SARS-CoV-2-Sequenzdaten_Deutschland.fasta.xz > new_RKI_seqs.fa
rm SARS-CoV-2-Sequenzdaten_Deutschland.fasta.xz

## remove sequences from fresh download that are not new
## store newly added rki sequences in newly_added_RKI_seqs.fa
samtools faidx old_RKI_seqs.fa
samtools faidx new_RKI_seqs.fa
cut -f1 < old_RKI_seqs.fa.fai > deleteList.txt
remove_ids=($(awk '{print $1}' new_RKI_seqs.fa.fai | grep -v -f deleteList.txt))
samtools faidx -o newly_added_RKI_seqs.fa new_RKI_seqs.fa "${remove_ids[@]}"

## replace . with Ns in new sequences
sed 's/\.//g' newly_added_RKI_seqs.fa > newly_added_RKI_seqs_corrected.fa

## multiple sequence alignment of new sequences against wuhan reference seq
mafft --thread 10 --auto --keeplength --addfragments newly_added_RKI_seqs_corrected.fa wuhan.fasta >  newly_added_RKI_seqs_corrected_aln.fa
faToVcf  newly_added_RKI_seqs_corrected_aln.fa  newly_added_RKI_seqs_corrected_aln.vcf
#wget https://raw.githubusercontent.com/W-L/ProblematicSites_SARS-CoV2/master/problematic_sites_sarsCov2.vcf
#faToVcf -maskSites=problematic_sites_sarsCov2.vcf newly_added_RKI_seqs_corrected_aln.fa  newly_added_RKI_seqs_corrected_aln.vcf

## Integrate into usher tree
rm global_assignments.pb
mv new_global_assignments.pb global_assignments.pb
rm new_global_assignments.pb
usher -i global_assignments.pb -v newly_added_RKI_seqs_corrected_aln.vcf -u -o new_global_assignments.pb -d /datasets/usher/
