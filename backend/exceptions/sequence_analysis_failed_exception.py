class SequenceAnalysisFailedException(Exception):
    """Exception thrown whenever a sequence analysis fails."""

    def __init__(self):
        self.message = "Genomic sequence analysis failed."
