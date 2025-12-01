from src.domains.sequence_analysis.exceptions import GenomicErrorException, SequenceAnalysisFailedException

### GenomicErrorException ###


def test_genomic_error_exceptions_has_correct_message():
    exception = GenomicErrorException()
    assert exception.message == "Genomic sequence does not contain valid structure."


### SequenceAnalysisFailedException ###


def test_sequence_analysis_failed_exception_has_correct_message():
    exception = SequenceAnalysisFailedException()
    assert exception.message == "Genomic sequence analysis failed."
