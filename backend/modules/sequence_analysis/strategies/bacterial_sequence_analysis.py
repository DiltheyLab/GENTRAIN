import json
import shutil
import time
import pathlib
import tempfile
import sys
from os import popen
from subprocess import Popen

from werkzeug.utils import secure_filename

from backend.modules.core.exceptions import SequenceAnalysisFailedException
from backend.config import get_project_path
from backend.modules.sequence_analysis.strategies.sequence_analysis_strategy import (
    SequenceAnalysisStrategy, sio,
)
from backend.modules.sequence_analysis.response_models import BacterialSequenceAnalysisResponseModel


class BacterialSequenceAnalysis(SequenceAnalysisStrategy):
    """Concrete analysis strategy for bacterial sequences."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.type = "bacterial"

    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""
        return []

    def create_input_and_output_files(self):
        """Create a fasta input file and a json output file for script."""
        # create directory if not existent
        self.input = f"{get_project_path()}/temp_data/sequence_analysis/{self.identifier}_{round(time.time() * 1000)}/"
        pathlib.Path(self.input).mkdir(parents=True, exist_ok=True)

        # Create a temporary fasta file that is read by the bash script
        # and a json file in which the response will be written
        input_file = tempfile.NamedTemporaryFile(
            dir=self.input, suffix=".fa", delete=False
        ).name
        self.index_sequences()
        with open(file=input_file, mode="w", encoding="utf-8") as input_file:
            input_file.write(self.fasta_content)
        self.output = f"{get_project_path()}/temp_data/sequence_analysis/outputs/{self.identifier}_{round(time.time() * 1000)}"

    def index_sequences(self):
        count = 0
        result = ""
        for char in self.fasta_content:
            if char == ">":
                result += f">{count}"
                count += 1
            else:
                result += char
        self.fasta_content = result

    def tsv2json(self, file):
        arr = []
        a = file.readline()

        # The first line consist of headings of the record
        # so we will store it in an array and move to
        # next line in input_file.
        titles = [t.strip() for t in a.split("\t")]
        for line in file:
            d = {}
            for t, f in zip(titles, line.split("\t")):
                if t == "FILE":
                    continue
                # Convert each row into dictionary with keys as titles
                d[t] = f.strip()

            # we will use strip to remove '\n'.
            arr.append(d)

            # we will append all the individual dictionaires into list
            # and dump into file.
            result = arr[0]
        return result

    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""
        process = Popen(
            [
                "perl",
                f"{get_project_path()}/modules/sequence_analysis/scripts/bacterial.pl",
                "-input",
                self.input,
                "-scheme",
                f"{get_project_path()}/modules/sequence_analysis/schemes/{secure_filename(self.pathogen.scheme_name)}",
                "-output",
                self.output,
            ],
            stdout=sys.stdout,
        )
        process.wait()
        if process.returncode != 0:
            shutil.rmtree(self.input)
            raise SequenceAnalysisFailedException
        else:
            results = {}
            with open(
                    file=f"{self.output}/results_alleles_hashed.tsv",
                    mode="r",
                    encoding="utf-8",
            ) as tsv_file:
                results["allele_hashes"] = self.tsv2json(tsv_file)
            with open(
                    file=f"{self.output}/results_alleles.tsv",
                    mode="r",
                    encoding="utf-8",
            ) as tsv_file:
                results["allele_ids"] = self.tsv2json(tsv_file)

            # collect parameters for quality classification of the assembley
            results["undeterminable_gen_count"] = sum(
                results["allele_hashes"][gen] == "-" for gen in results["allele_hashes"]
            )
            results["contig_count"] = self.fasta_content.count(">")
            results["first_contig_length"] = self.get_first_contig_length()
            shutil.rmtree(self.input)
            shutil.rmtree(self.output)
            return results

    def get_first_contig_length(self):
        """Return the length of the assembleys first contig, which indicates the quality of the assembly.
        The signiticance of this parameter depends on the sequencing method (hybrid, illumina or nanopore).
        """
        sequence_without_newlines_and_contig_id = self.fasta_content.replace(
            "\n", ""
        ).replace("0", "")
        first_contig = sequence_without_newlines_and_contig_id.split(">", 2)[1]
        return len(first_contig)

    def persist_and_emit_response(self, result):
        response = self.get_response(result)
        self.persist_result(response)
        sio.emit(
            "sequence_analysis_response",
            {
                "status": "success",
                "result": response,
                "sequence_identifier": self.identifier,
            },
            to=f"{self.type}_{self.socket_id}",
        )

    def get_response(self, result):
        """Return a response model for bacterial analysises."""
        # retrieve the installed chewBBACA version (gentrain-worker and gentrain-backend versions are synced)
        chewBBACCA_version = popen("chewBBACA.py -v").read().replace("chewBBACA version:", "").replace("\n", "").strip()
        return [BacterialSequenceAnalysisResponseModel(
            chewBACCA_version=chewBBACCA_version,
            analysis_schema=self.pathogen.scheme_name,
            allele_ids=result["allele_ids"],
            allele_hashes=result["allele_hashes"],
            undeterminable_gen_count=result["undeterminable_gen_count"],
            contig_count=result["contig_count"],
            first_contig_length=result["first_contig_length"],
        ).model_dump()]

    def emit_enqueued_event(self):
        sio.emit(
            "sequence_analysis_enqueued",
            self.identifier,
            to=f"{self.type}_{self.socket_id}",
        )

    def emit_started_event(self):
        sio.emit(
            "sequence_analysis_started",
            self.identifier,
            to=f"{self.type}_{self.socket_id}",
        )

    def emit_failed_event(self):
        sio.emit(
            "sequence_analysis_response",
            {
                "status": "error",
                "sequence_identifier": self.identifier,
            },
            to=f"{self.type}_{self.socket_id}",
        )
