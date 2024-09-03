import json
import pathlib
import re
import subprocess
import tempfile
from backend.exceptions.sequence_analysis_failed_exception import (
    SequenceAnalysisFailedException,
)
from backend.exceptions.genomic_error_exception import GenomicErrorException
from backend.config import get_project_path
from backend.models.sequence_analysis import ViralSequenceAnalysisResponseModel
from backend.strategies.sequence_analysis.sequence_analysis_strategy import (
    SequenceAnalysisStrategy,
)


class ViralSequenceAnalysis(SequenceAnalysisStrategy):
    """Concrete analysis strategy for viral sequences."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.queue = "viral"

    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""
        illegal_characters = re.findall("[^ATGCRYSWKMBDHVNXU]+", self.sequence)
        return illegal_characters

    def create_input_and_output_files(self):
        """Create a fasta input file and a json output file for script."""
        # create directory if not existent
        temp_dir = f"{get_project_path()}/temp_data/sequence_analysis/"
        pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

        # Create a temporary fasta file that is read by the bash script
        # and a json file in which the response will be written
        self.input = tempfile.NamedTemporaryFile(
            dir=temp_dir, suffix=".fa", delete=False
        ).name
        with open(file=self.input, mode="w", encoding="utf-8") as input_file:
            input_file.write(f">{self.fasta_id}\n{self.sequence}")
        self.output = self.input[:-2] + "json"

    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""
        process = subprocess.run(
            [
                f"{get_project_path()}/scripts/sequence_analysis/viral.sh",
                self.input,
                self.output,
                f"{get_project_path()}/datasets/nextclade_covid",
            ],
            check=False,
        )
        if process.returncode != 0:
            pathlib.Path(self.input).unlink(missing_ok=True)
            pathlib.Path(self.output).unlink(missing_ok=True)
            raise SequenceAnalysisFailedException
        else:
            with open(file=self.output, mode="r", encoding="utf-8") as json_file:
                # check for script errors
                content = json.load(json_file)
                if content["errors"] and len(content["errors"]) > 0:
                    raise GenomicErrorException

                content = content["results"][0]
                # delete the temporary files. If they can not be found ignore it
                pathlib.Path(self.input).unlink(missing_ok=True)
                pathlib.Path(self.output).unlink(missing_ok=True)
                return content

    def get_response(self, result):
        """Return a response model for viral analysises."""
        return ViralSequenceAnalysisResponseModel(
            nextclade_version="1.2.2",
            lineage=f"{result['clade']}, {result['customNodeAttributes']['Nextclade_pango']}",
            n_count=result["totalMissing"],
            substitutions=result["substitutions"],
            deletions=result["deletions"],
            insertions=result["insertions"],
            missing=result["missing"],
            nonACGTNs=result["nonACGTNs"],
            alignmentRange=result["alignmentRange"],
        ).model_dump()
