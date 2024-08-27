#!/usr/bin/perl
#
# run example:	perl calling_script_bacteria.pl --input /path/to/assembbly_folder --scheme /path/to/scheme_folder --output /path/to/output_folder
# scheme folder needs to be formatted as: "path/[Pathogen]-[SchemeType]-[Date]"
#

use Getopt::Long;
use strict;
use warnings;

my(@pool, $id, $input, $scheme, $output, $md5, $chewBBACA_version, $run_date, $pathogen, $type, $scheme_date, $chew);	# initiate variables

@pool=('0'..'9','A'..'F');																						# creade array for ID
$id=join''=>map$pool[rand @pool],1..10;																			# create random ID

GetOptions (
	'input:s' => \$input,		### either a folder with one file orde a file with the path to that one file
	'scheme:s' => \$scheme,
	'output:s' => \$output,
);
unless($input){die "\nERROR:\nPlease specify the assembly folder using --input.\n\n"}
unless($scheme){die "\nERROR:\nPlease specify the scheme folder using --scheme.\n\n"}
unless($output){die "\nERROR:\nPlease specify the output folder using --output.\n\n"}

system("chewBBACA.py AlleleCall --hash-profiles md5 -i $input -g $scheme -o $output --cpu 4") and die;

$md5=`cat $scheme/* $scheme/*/* | md5sum`;																		# running md5sum
$chewBBACA_version=`chewBBACA.py --version`;																	# save chewBBACA version
$run_date=`date`;																								# save date of the analysis																				# save fasta name

if($scheme=~m/.*\/(.+)-(.+)-(.+)/){$pathogen=$1; $type=$2; $scheme_date=$3}										# save pathogen and scheme date # !!! scheme in the format "path/[Pathogen]-[SchemeType]-[Date]"
else{$pathogen="not provided"; $type="not provided"; $scheme_date="not provided"}								# set pathogen and scheme date to "not provided" if format incorrect


open(RESULTS1,'>',"$output/$id\_chewBBACA_summary.txt");				# ???	change random ID to real ID		# write to chewBBACA summary file

print RESULTS1 "ChewBBACA_version: $chewBBACA_version";																				# print chewBBACA version
print RESULTS1 "Analysed_on: $run_date\n";																		# print date of the analysis
print RESULTS1 "Provided_input: $input\n";																		# print input name
print RESULTS1 "Analysed_pathogen: $pathogen\n";																# print input name
print RESULTS1 "Used_scheme_type: $type\n";																		# print analysed pathogen
print RESULTS1 "Scheme_creation_date: $scheme_date\n";															# print scheme date
print RESULTS1 "Scheme_md5sum: $md5\n";																			# print md5sum
print RESULTS1 "\n----------\n\n$type\_Vector:\n\n";	

open(CHEW,"$output/results_alleles.tsv") or die "\nchewBBACA output not found.\n\n";							# read chewBBACA output
while($chew = <CHEW>){
	chomp($chew);
	print  RESULTS1 "$chew\n";																					# print chewBBACA vector into summary file
}
close(CHEW);

open(RESULTS2,'>',"$output/$id\_chewBBACA_summary_hashed.txt");			# ???	change random ID to real ID		# write to chewBBACA summary file

print RESULTS2 "ChewBBACA_version: $chewBBACA_version";																				# print chewBBACA version
print RESULTS2 "Analysed_on: $run_date\n";																		# print date of the analysis
print RESULTS2 "Provided_input: $input\n";																		# print input name
print RESULTS2 "Analysed_pathogen: $pathogen\n";																# print input name
print RESULTS2 "Used_scheme_type: $type\n";																		# print analysed pathogen
print RESULTS2 "Scheme_creation_date: $scheme_date\n";															# print scheme date
print RESULTS2 "Scheme_md5sum: $md5\n";																			# print md5sum
print RESULTS2 "Hashing_algorithm_for_profiles: md5\n";	
print RESULTS2 "\n----------\n\n$type\_Vector:\n\n";	

open(CHEW,"$output/results_alleles_hashed.tsv") or die "\nchewBBACA output not found.\n\n";							# read chewBBACA output
while($chew = <CHEW>){
	chomp($chew);
	print  RESULTS2 "$chew\n";	
}
close(CHEW);
