from backend.strategies.sequence_analysis.bacterial_sequence_analysis import (
    BacterialSequenceAnalysis,
)
from backend.strategies.sequence_analysis.viral_sequence_analysis import (
    ViralSequenceAnalysis,
)
from backend.admin.models import Pathogen


pathogen_type_mappings = {
    "viral": ["covid-19"],
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
        pathogen: Pathogen,
        fasta_id: str,
        sequence: str,
        socket_id: str,
    ):
        """Initialize and return a strategy based on pathogen type."""
        if pathogen is not None:
            if pathogen.type == "viral":
                return ViralSequenceAnalysis(pathogen, fasta_id, sequence, socket_id)
            if pathogen.type == "bacterial":
                return BacterialSequenceAnalysis(
                    pathogen, fasta_id, sequence, socket_id
                )

        return
