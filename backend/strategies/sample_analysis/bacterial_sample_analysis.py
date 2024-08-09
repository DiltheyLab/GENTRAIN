from backend.strategies.sample_analysis.sample_analysis_strategy import (
    SampleAnalysisStrategy,
)
from backend.controllers.models.sequence_variants import (
    BacterialSequenceVariantsResponseModel,
)
import json
import pathlib
import subprocess
from backend.config import get_project_path
from backend.exceptions.sequence_analysis_failed_exception import (
    SequenceAnalysisFailedException,
)
from backend.exceptions.genomic_error_exception import GenomicErrorException


class BacterialSampleAnalysis(SampleAnalysisStrategy):
    """Concrete analysis strategy for bacterial samples."""

    def __init__(self, pathogen_name, fasta_id, sequence, scheme):
        super().__init__(pathogen_name, fasta_id, sequence)
        self.scheme = scheme

    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""
        return []

    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""
        process = subprocess.Popen(
            [
                "perl",
                "bacterial.sh",
                f"{get_project_path()}/scripts/sample_analysis/",
                self.input,
                self.scheme,
                self.output,
            ]
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

    def get_response(self, _):
        """Return a response model for bacterial analysises."""
        return BacterialSequenceVariantsResponseModel(alleles=[])
