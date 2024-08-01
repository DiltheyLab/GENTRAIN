from backend.strategies.sample_analysis.sample_analysis_strategy import (
    SampleAnalysisStrategy,
)
from backend.controllers.requests.models.sequence_variants import (
    BacterialSequenceVariantsResponseModel,
)


class BacterialSampleAnalysis(SampleAnalysisStrategy):
    """Concrete analysis strategy for bacterial samples."""

    def get_response(self, result):
        """Return a response model for viral analysises."""
        return BacterialSequenceVariantsResponseModel(schema="schema", alleles=[])
