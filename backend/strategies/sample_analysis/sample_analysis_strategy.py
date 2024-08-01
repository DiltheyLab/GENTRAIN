from abc import ABC, abstractmethod
import json
import re
import pathlib
import subprocess
import tempfile
from backend.exceptions.genomic_error_exception import GenomicErrorException
from backend.exceptions.sequence_analysis_failed_exception import (
    SequenceAnalysisFailedException,
)


class SampleAnalysisStrategy(ABC):
    """Sample Analisys Strategy Class."""

    def __init__(self, pathogen_id, fasta_id, sequence):
        self.fasta_id = fasta_id
        self.sequence = sequence
        self.pathogen_id = pathogen_id
        self.input_file = None
        self.output_file = None

    @abstractmethod
    def get_response(self, result):
        """Get pydantic response model based on strategy."""

    def execute(self):
        """Run strategy actions."""
        genomic_errors = self.find_genomic_validation_errors()
        if genomic_errors and len(genomic_errors) > 0:
            raise GenomicErrorException
        self.create_input_and_output_files()
        return self.run_analysis()

    def create_input_and_output_files(self):
        """Create a fasta input file and a json output file for script."""
        # create directory if not existent
        temp_dir = "./temp_data/sample_analysis/"
        pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

        # Create a temporary fasta file that is read by the bash script
        # and a json file in which the response will be written
        self.input_file = tempfile.NamedTemporaryFile(
            dir=temp_dir, suffix=".fa", delete=False
        ).name
        with open(file=self.input_file, mode="w", encoding="utf-8") as input_file:
            input_file.write(f">{self.fasta_id}\n{self.sequence}")
        self.output_file = self.input_file[:-2] + "json"

    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""
        process = subprocess.run(
            [
                f"./scripts/pathogens/{self.pathogen_id}.sh",
                self.input_file,
                self.output_file,
            ],
            check=False,
        )
        if process.returncode != 0:
            pathlib.Path(self.input_file).unlink(missing_ok=True)
            pathlib.Path(self.output_file).unlink(missing_ok=True)
            raise SequenceAnalysisFailedException
        else:
            with open(file=self.output_file, mode="r", encoding="utf-8") as json_file:
                # check for script errors
                content = json.load(json_file)
                if content["errors"] and len(content["errors"]) > 0:
                    raise GenomicErrorException

                content = content["results"][0]
                # delete the temporary files. If they can not be found ignore it
                pathlib.Path(self.input_file).unlink(missing_ok=True)
                pathlib.Path(self.output_file).unlink(missing_ok=True)
                return content

    # custom validators
    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""
        illegal_characters = re.findall("[^ATGCRYSWKMBDHVNXU]+", self.sequence)
        return illegal_characters
