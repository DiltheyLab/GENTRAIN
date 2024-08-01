class SequenceAnalysisFailedException(Exception):
    """Exception thrown whenever a sequence analysis fails."""

    def __init__(self):
        super().__init__("Genomic sequence analysis failed.")
