from backend.strategies.sequence_analysis.bacterial_sequence_analysis import (
    BacterialSequenceAnalysis,
)
from backend.strategies.sequence_analysis.viral_sequence_analysis import (
    ViralSequenceAnalysis,
)


pathogen_type_mappings = {
    "viral": ["SARS-CoV-2"],
    "bacterial": [
        "enterococcus-faecium",
        "staphylococcus-aureus",
        "bordetella-pertussis",
    ],
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
    def get_sequence_analysis_strategy(
        pathogen_name: str,
        fasta_id: str,
        sequence: str,
        socket_id: str,
    ):
        """Initialize and return a strategy based on pathogen type."""
        if (
            PathogenStrategyManager.get_type_for_pathogen(pathogen_name=pathogen_name)
            == "viral"
        ):
            return ViralSequenceAnalysis(pathogen_name, fasta_id, sequence, socket_id)
        if (
            PathogenStrategyManager.get_type_for_pathogen(pathogen_name=pathogen_name)
            == "bacterial"
        ):
            return BacterialSequenceAnalysis(
                pathogen_name, fasta_id, sequence, socket_id
            )

        return
