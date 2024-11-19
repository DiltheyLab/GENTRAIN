from flask import Response
from werkzeug.exceptions import HTTPException


class GenomicErrorException(Exception):
    """Exception thrown whenever a sequence contains genomic errors."""

    def __init__(self):
        self.message = "Genomic sequence does not contain valid structure."


class SequenceAnalysisFailedException(Exception):
    """Exception thrown whenever a sequence analysis fails."""

    def __init__(self):
        self.message = "Genomic sequence analysis failed."

class AuthException(HTTPException):
    def __init__(self, message):
        super().__init__(message, Response(
            "You could not be authenticated. Please refresh the page.", 401,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}))
