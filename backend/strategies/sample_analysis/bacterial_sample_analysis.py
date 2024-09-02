import shutil
import time
import pathlib
import tempfile
import sys
from subprocess import Popen
from backend.exceptions.sequence_analysis_failed_exception import (
    SequenceAnalysisFailedException,
)
from backend.config import get_project_path
from backend.strategies.sequence_analysis.sequence_analysis_strategy import (
    SequenceAnalysisStrategy,
)


class BacterialSequenceAnalysis(SequenceAnalysisStrategy):
    """Concrete analysis strategy for bacterial sequences."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.queue = "bacterial"

    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""
        return []

    def create_input_and_output_files(self):
        """Create a fasta input file and a json output file for script."""
        # create directory if not existent
        self.input = f"{get_project_path()}/temp_data/sequence_analysis/{self.fasta_id}_{round(time.time() * 1000)}/"
        pathlib.Path(self.input).mkdir(parents=True, exist_ok=True)

        # Create a temporary fasta file that is read by the bash script
        # and a json file in which the response will be written
        input_file = tempfile.NamedTemporaryFile(
            dir=self.input, suffix=".fa", delete=False
        ).name
        with open(file=input_file, mode="w", encoding="utf-8") as input_file:
            input_file.write(self.sequence)
        self.output = f"{get_project_path()}/temp_data/sequence_analysis/outputs/{self.fasta_id}_{round(time.time() * 1000)}"

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
                f"{get_project_path()}/scripts/sequence_analysis/bacterial.pl",
                "-input",
                self.input,
                "-scheme",
                f"{get_project_path()}/datasets/chewBBACA_schemes/{self.pathogen_name}",
                "-output",
                self.output,
            ],
            stdout=sys.stdout,
        )
        process.wait()
        if process.returncode != 0:
            shutil.rmtree(self.input)
            shutil.rmtree(self.output)
            raise SequenceAnalysisFailedException
        else:
            with open(
                file=f"{self.output}/results_alleles_hashed.tsv",
                mode="r",
                encoding="utf-8",
            ) as tsv_file:
                shutil.rmtree(self.input)
                shutil.rmtree(self.output)
                return self.tsv2json(tsv_file)

    def get_response(self, result):
        """Return a response model for bacterial analysises."""
        return result
