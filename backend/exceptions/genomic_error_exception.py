class GenomicErrorException(Exception):
    """Exception thrown whenever a sequence contains genomic errors.."""

    def __init__(self):
        super().__init__("Genomic sequence does not contain valid structure.")
