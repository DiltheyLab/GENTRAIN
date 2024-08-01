class GenomicErrorException(Exception):
    """Exception thrown whenever a sequence contains genomic errors.."""

    def __init__(self):
        self.message = "Genomic sequence does not contain valid structure."
