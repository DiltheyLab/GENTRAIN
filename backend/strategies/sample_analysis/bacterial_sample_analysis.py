from backend.strategies.sample_analysis.sample_analysis_strategy import (
    SampleAnalysisStrategy,
)
from backend.controllers.models.sequence_variants import (
    BacterialSequenceVariantsResponseModel,
)


class BacterialSampleAnalysis(SampleAnalysisStrategy):
    """Concrete analysis strategy for bacterial samples."""

    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""
        return []

    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""
        return []

    def get_response(self, result):
        """Return a response model for bacterial analysises."""
        return BacterialSequenceVariantsResponseModel(alleles=[])
