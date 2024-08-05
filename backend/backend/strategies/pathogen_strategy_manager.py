from backend.strategies.sample_analysis.viral_sample_analysis import ViralSampleAnalysis
from backend.strategies.sample_analysis.bacterial_sample_analysis import (
    BacterialSampleAnalysis,
)


class PathogenStrategyManager:
    """Class to manage pathogen strategies."""

    @staticmethod
    def get_sample_analysis_strategy(pathogen_id: str, fasta_id: str, sequence: str):
        """Initialize and return a strategy based on pathogen."""
        if pathogen_id == "covid-19":
            return ViralSampleAnalysis(pathogen_id, fasta_id, sequence)
        return BacterialSampleAnalysis(pathogen_id, fasta_id, sequence)
