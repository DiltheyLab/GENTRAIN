import pytest
from unittest.mock import MagicMock
from src.domains.sequence_analysis.strategies.sequence_analysis_strategy import (
    SequenceAnalysisStrategy,
)
from src.domains.sequence_analysis.exceptions import (
    GenomicErrorException,
    SequenceAnalysisFailedException,
)


# Concrete implementation for testing the abstract class
class ConcreteSequenceAnalysisStrategy(SequenceAnalysisStrategy):
    """Concrete implementation for testing purposes."""

    def create_input_and_output_files(self):
        self.input = "test_input"
        self.output = "test_output"

    def emit_enqueued_event(self):
        pass

    def emit_started_event(self):
        pass

    def emit_failed_event(self):
        pass

    def get_response(self, result):
        return {"result": result}  # type: ignore

    def persist_and_emit_response(self, result):
        pass

    def find_genomic_validation_errors(self):
        return []  # type: ignore

    def run_analysis(self):
        return {"analysis": "complete"}  # type: ignore


@pytest.fixture
def mock_pathogen(make_pathogen):
    return make_pathogen(pathogen_id=1, name="Test Pathogen", pathogen_type="viral")


@pytest.fixture
def strategy(mock_pathogen):
    return ConcreteSequenceAnalysisStrategy(
        pathogen=mock_pathogen,
        fasta_content=">seq1\nACGT",
        socket_id="test_socket_123",
    )


### __init__ ###


def test_init_sets_fasta_content(mock_pathogen):
    fasta_content = ">sequence\nACGTACGT"
    strategy = ConcreteSequenceAnalysisStrategy(
        pathogen=mock_pathogen, fasta_content=fasta_content, socket_id="socket_123"
    )

    assert strategy.fasta_content == fasta_content


def test_init_sets_pathogen(mock_pathogen):
    strategy = ConcreteSequenceAnalysisStrategy(
        pathogen=mock_pathogen, fasta_content=">seq\nACGT", socket_id="socket_123"
    )

    assert strategy.pathogen == mock_pathogen


def test_init_sets_socket_id(mock_pathogen):
    socket_id = "test_socket_456"
    strategy = ConcreteSequenceAnalysisStrategy(
        pathogen=mock_pathogen, fasta_content=">seq\nACGT", socket_id=socket_id
    )

    assert strategy.socket_id == socket_id


def test_init_initializes_type_as_none(mock_pathogen):
    strategy = ConcreteSequenceAnalysisStrategy(
        pathogen=mock_pathogen, fasta_content=">seq\nACGT", socket_id="socket_123"
    )

    assert strategy.type is None


def test_init_initializes_input_as_none(mock_pathogen):
    strategy = ConcreteSequenceAnalysisStrategy(
        pathogen=mock_pathogen, fasta_content=">seq\nACGT", socket_id="socket_123"
    )

    assert strategy.input is None


def test_init_initializes_output_as_none(mock_pathogen):
    strategy = ConcreteSequenceAnalysisStrategy(
        pathogen=mock_pathogen, fasta_content=">seq\nACGT", socket_id="socket_123"
    )

    assert strategy.output is None


def test_init_initializes_sequences_as_empty_dict(mock_pathogen):
    strategy = ConcreteSequenceAnalysisStrategy(
        pathogen=mock_pathogen, fasta_content=">seq\nACGT", socket_id="socket_123"
    )

    assert strategy.sequences == {}


### persist_result ###


def test_persist_result_stores_in_redis(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    fasta_hash = "test_hash_123"
    result_object = {"status": "complete", "data": "test_data"}

    strategy.persist_result(fasta_hash, result_object)

    mock_redis.hmset.assert_called_once_with(
        "client:sequence_analysis:test_hash_123",
        {"result": '{"status": "complete", "data": "test_data"}'},
    )


def test_persist_result_sets_expiration(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    fasta_hash = "test_hash_456"
    result_object = {"status": "complete"}

    strategy.persist_result(fasta_hash, result_object)

    mock_redis.expire.assert_called_once_with(
        name="client:sequence_analysis:test_hash_456", time=1800
    )


def test_persist_result_serializes_result_as_json(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    fasta_hash = "hash_789"
    result_object = {"key1": "value1", "key2": [1, 2, 3]}

    strategy.persist_result(fasta_hash, result_object)

    call_args = mock_redis.hmset.call_args[0]
    assert call_args[1]["result"] == '{"key1": "value1", "key2": [1, 2, 3]}'


### execute ###


def test_execute_emits_started_event(strategy, mocker):
    mock_emit_started = mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mocker.patch.object(strategy, "create_input_and_output_files")
    mocker.patch.object(strategy, "run_analysis", return_value={"result": "success"})
    mocker.patch.object(strategy, "persist_and_emit_response")

    strategy.execute()

    mock_emit_started.assert_called_once()


def test_execute_checks_for_genomic_errors(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mock_find_errors = mocker.patch.object(
        strategy, "find_genomic_validation_errors", return_value=[]
    )
    mocker.patch.object(strategy, "create_input_and_output_files")
    mocker.patch.object(strategy, "run_analysis", return_value={"result": "success"})
    mocker.patch.object(strategy, "persist_and_emit_response")

    strategy.execute()

    mock_find_errors.assert_called_once()


def test_execute_raises_exception_when_genomic_errors_found(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(
        strategy, "find_genomic_validation_errors", return_value=["error1", "error2"]
    )
    mock_emit_failed = mocker.patch.object(strategy, "emit_failed_event")
    mock_create_files = mocker.patch.object(strategy, "create_input_and_output_files")

    strategy.execute()

    mock_emit_failed.assert_called_once()
    mock_create_files.assert_not_called()


def test_execute_creates_input_and_output_files(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mock_create_files = mocker.patch.object(strategy, "create_input_and_output_files")
    mocker.patch.object(strategy, "run_analysis", return_value={"result": "success"})
    mocker.patch.object(strategy, "persist_and_emit_response")

    strategy.execute()

    mock_create_files.assert_called_once()


def test_execute_runs_analysis(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mocker.patch.object(strategy, "create_input_and_output_files")
    mock_run_analysis = mocker.patch.object(
        strategy, "run_analysis", return_value={"result": "success"}
    )
    mocker.patch.object(strategy, "persist_and_emit_response")

    strategy.execute()

    mock_run_analysis.assert_called_once()


def test_execute_persists_and_emits_response(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mocker.patch.object(strategy, "create_input_and_output_files")
    result = {"result": "success", "data": "test"}
    mocker.patch.object(strategy, "run_analysis", return_value=result)
    mock_persist_emit = mocker.patch.object(strategy, "persist_and_emit_response")

    strategy.execute()

    mock_persist_emit.assert_called_once_with(result)


def test_execute_returns_result(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mocker.patch.object(strategy, "create_input_and_output_files")
    expected_result = {"result": "success", "analysis_data": "complete"}
    mocker.patch.object(strategy, "run_analysis", return_value=expected_result)
    mocker.patch.object(strategy, "persist_and_emit_response")

    result = strategy.execute()

    assert result == expected_result


def test_execute_emits_failed_event_on_sequence_analysis_exception(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mocker.patch.object(strategy, "create_input_and_output_files")
    mocker.patch.object(
        strategy,
        "run_analysis",
        side_effect=SequenceAnalysisFailedException(),
    )
    mock_emit_failed = mocker.patch.object(strategy, "emit_failed_event")

    result = strategy.execute()

    mock_emit_failed.assert_called_once()
    assert result is None


def test_execute_emits_failed_event_on_generic_exception(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mocker.patch.object(strategy, "create_input_and_output_files")
    mocker.patch.object(strategy, "run_analysis", side_effect=Exception("Unexpected error"))
    mock_emit_failed = mocker.patch.object(strategy, "emit_failed_event")

    result = strategy.execute()

    mock_emit_failed.assert_called_once()
    assert result is None


def test_execute_logs_sequence_analysis_exception(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mocker.patch.object(strategy, "create_input_and_output_files")
    mocker.patch.object(
        strategy,
        "run_analysis",
        side_effect=SequenceAnalysisFailedException(),
    )
    mocker.patch.object(strategy, "emit_failed_event")
    mock_logging = mocker.patch("src.domains.sequence_analysis.strategies.sequence_analysis_strategy.logging")

    strategy.execute()

    mock_logging.exception.assert_called_once()


def test_execute_logs_generic_exception(strategy, mocker):
    mocker.patch.object(strategy, "emit_started_event")
    mocker.patch.object(strategy, "find_genomic_validation_errors", return_value=[])
    mocker.patch.object(strategy, "create_input_and_output_files")
    mocker.patch.object(strategy, "run_analysis", side_effect=Exception("Unexpected error"))
    mocker.patch.object(strategy, "emit_failed_event")
    mock_logging = mocker.patch("src.domains.sequence_analysis.strategies.sequence_analysis_strategy.logging")

    strategy.execute()

    mock_logging.exception.assert_called_once()


### enqueue_analysis ###


def test_enqueue_analysis_enqueues_execute_method(strategy, mocker):
    mock_queue = MagicMock()
    mocker.patch.object(strategy, "emit_enqueued_event")

    strategy.enqueue_analysis(mock_queue)

    mock_queue.enqueue.assert_called_once_with(
        strategy.execute, result_ttl=0, job_timeout=600
    )


def test_enqueue_analysis_emits_enqueued_event(strategy, mocker):
    mock_queue = MagicMock()
    mock_emit_enqueued = mocker.patch.object(strategy, "emit_enqueued_event")

    strategy.enqueue_analysis(mock_queue)

    mock_emit_enqueued.assert_called_once()


def test_enqueue_analysis_emits_enqueued_event_after_enqueuing(strategy, mocker):
    mock_queue = MagicMock()
    call_order = []
    
    def track_enqueue(*args, **kwargs):
        call_order.append("enqueue")
    
    def track_emit():
        call_order.append("emit")
    
    mock_queue.enqueue.side_effect = track_enqueue
    mocker.patch.object(strategy, "emit_enqueued_event", side_effect=track_emit)

    strategy.enqueue_analysis(mock_queue)

    assert call_order == ["enqueue", "emit"]


def test_enqueue_analysis_sets_result_ttl_to_zero(strategy, mocker):
    mock_queue = MagicMock()
    mocker.patch.object(strategy, "emit_enqueued_event")

    strategy.enqueue_analysis(mock_queue)

    assert mock_queue.enqueue.call_args[1]["result_ttl"] == 0


def test_enqueue_analysis_sets_job_timeout_to_600(strategy, mocker):
    mock_queue = MagicMock()
    mocker.patch.object(strategy, "emit_enqueued_event")

    strategy.enqueue_analysis(mock_queue)

    assert mock_queue.enqueue.call_args[1]["job_timeout"] == 600
