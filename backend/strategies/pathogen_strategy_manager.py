from backend.strategies.sample_analysis.viral_sample_analysis import ViralSampleAnalysis
from backend.strategies.sample_analysis.bacterial_sample_analysis import (
    BacterialSampleAnalysis,
)


pathogen_type_mappings = {
    "viral": ["covid-19"],
    "bacterial": ["rse", "enterococcus-faecium"],
}


class PathogenStrategyManager:
    """Class to manage pathogen strategies."""

    @staticmethod
    def get_type_for_pathogen(pathogen_name):
        """Get the corresponding pathogen type (viral / bacterial) for a given pathogen name."""
        if pathogen_name in pathogen_type_mappings["viral"]:
            return "viral"
        if pathogen_name in pathogen_type_mappings["bacterial"]:
            return "bacterial"
        return

    @staticmethod
    def get_sample_analysis_strategy(pathogen_name: str, fasta_id: str, sequence: str):
        """Initialize and return a strategy based on pathogen type."""
        if (
            PathogenStrategyManager.get_type_for_pathogen(pathogen_name=pathogen_name)
            == "viral"
        ):
            return ViralSampleAnalysis(pathogen_name, fasta_id, sequence)
        if (
            PathogenStrategyManager.get_type_for_pathogen(pathogen_name=pathogen_name)
            == "bacterial"
        ):
            return BacterialSampleAnalysis(pathogen_name, fasta_id, sequence)

        return
