from backend.strategies.sample_analysis.sample_analysis_strategy import (
    SampleAnalysisStrategy,
)
from backend.controllers.models.sequence_variants import (
    ViralSequenceVariantsResponseModel,
)
import json
import pathlib
import re
import subprocess
from backend.exceptions.sequence_analysis_failed_exception import (
    SequenceAnalysisFailedException,
)
from backend.exceptions.genomic_error_exception import GenomicErrorException


class ViralSampleAnalysis(SampleAnalysisStrategy):
    """Concrete analysis strategy for viral samples."""

    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""
        illegal_characters = re.findall("[^ATGCRYSWKMBDHVNXU]+", self.sequence)
        return illegal_characters

    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""
        process = subprocess.run(
            [
                f"/home/backend/scripts/pathogens/{self.pathogen_id}.sh",
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

    def get_response(self, result):
        """Return a response model for viral analysises."""
        return ViralSequenceVariantsResponseModel(
            lineage=f"{result['clade']}, {result['customNodeAttributes']['Nextclade_pango']}",
            n_count=result["totalMissing"],
            substitutions=result["substitutions"],
            deletions=result["deletions"],
            insertions=result["insertions"],
            missing=result["missing"],
            nonACGTNs=result["nonACGTNs"],
            alignmentStart=result["alignmentStart"],
            alignmentEnd=result["alignmentEnd"],
        )
