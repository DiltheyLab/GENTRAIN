from backend.strategies.sample_analysis.sample_analysis_strategy import (
    SampleAnalysisStrategy,
)
from backend.controllers.models.sequence_variants import (
    ViralSequenceVariantsResponseModel,
)


class ViralSampleAnalysis(SampleAnalysisStrategy):
    """Concrete analysis strategy for viral samples."""

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
