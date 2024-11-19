from backend.modules.sequence_analysis.strategies.bacterial_sequence_analysis import (
    BacterialSequenceAnalysis,
)
from backend.modules.sequence_analysis.strategies.viral_sequence_analysis import (
    ViralSequenceAnalysis,
)
from backend.modules.core.models import Pathogen


class PathogenStrategyManager:
    """Class to manage pathogen strategies."""

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
