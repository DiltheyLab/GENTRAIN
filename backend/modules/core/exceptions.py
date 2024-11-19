class GenomicErrorException(Exception):
    """Exception thrown whenever a sequence contains genomic errors."""

    def __init__(self):
        self.message = "Genomic sequence does not contain valid structure."


class SequenceAnalysisFailedException(Exception):
    """Exception thrown whenever a sequence analysis fails."""

    def __init__(self):
        self.message = "Genomic sequence analysis failed."

