import pytest
import json
from unittest.mock import MagicMock, mock_open
from io import StringIO
from src.domains.sequence_analysis.strategies.viral_sequence_analysis import (
    ViralSequenceAnalysis,
)
from src.domains.sequence_analysis.exceptions import (
    GenomicErrorException,
    SequenceAnalysisFailedException,
)


@pytest.fixture
def mock_pathogen(make_pathogen):
    return make_pathogen(pathogen_id=1, name="SARS-CoV-2", pathogen_type="viral")


@pytest.fixture
def fasta_content():
    return ">seq1\nATGCGTACGTACGT\n>seq2\nGCTAGCTAGCTA"


@pytest.fixture
def strategy(mock_pathogen, fasta_content, mocker):
    # Mock SeqIO.parse to avoid actual parsing
    mock_seqio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.SeqIO")
    mock_entry1 = MagicMock()
    mock_entry1.id = "seq1"
    mock_entry1.seq = "ATGCGTACGTACGT"
    mock_entry2 = MagicMock()
    mock_entry2.id = "seq2"
    mock_entry2.seq = "GCTAGCTAGCTA"
    mock_seqio.parse.return_value = [mock_entry1, mock_entry2]
    
    return ViralSequenceAnalysis(
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_789",
    )


### __init__ ###


def test_init_sets_type_to_viral(mock_pathogen, fasta_content, mocker):
    mock_seqio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.SeqIO")
    mock_entry = MagicMock()
    mock_entry.id = "seq1"
    mock_entry.seq = "ATGC"
    mock_seqio.parse.return_value = [mock_entry]
    
    strategy = ViralSequenceAnalysis(
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_123",
    )

    assert strategy.type == "viral"


def test_init_parses_fasta_sequences(mock_pathogen, fasta_content, mocker):
    mock_seqio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.SeqIO")
    mock_entry1 = MagicMock()
    mock_entry1.id = "seq1"
    mock_entry1.seq = "ATGC"
    mock_entry2 = MagicMock()
    mock_entry2.id = "seq2"
    mock_entry2.seq = "GCTA"
    mock_seqio.parse.return_value = [mock_entry1, mock_entry2]
    
    strategy = ViralSequenceAnalysis(
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_123",
    )

    assert "seq1" in strategy.sequences
    assert "seq2" in strategy.sequences
    assert strategy.sequences["seq1"] == "ATGC"
    assert strategy.sequences["seq2"] == "GCTA"


def test_init_converts_biopython_seq_to_string(mock_pathogen, fasta_content, mocker):
    mock_seqio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.SeqIO")
    mock_entry = MagicMock()
    mock_entry.id = "test_seq"
    mock_entry.seq = "ATGCGTACGT"
    mock_seqio.parse.return_value = [mock_entry]
    
    strategy = ViralSequenceAnalysis(
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_123",
    )

    assert isinstance(strategy.sequences["test_seq"], str)


def test_init_calls_parent_init(mock_pathogen, fasta_content, mocker):
    mock_seqio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.SeqIO")
    mock_entry = MagicMock()
    mock_entry.id = "seq1"
    mock_entry.seq = "ATGC"
    mock_seqio.parse.return_value = [mock_entry]
    
    strategy = ViralSequenceAnalysis(
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_456",
    )

    assert strategy.pathogen == mock_pathogen
    assert strategy.fasta_content == fasta_content
    assert strategy.socket_id == "socket_456"


### find_genomic_validation_errors ###


def test_find_genomic_validation_errors_returns_empty_list_for_valid_sequences(
    strategy,
):
    strategy.sequences = {
        "seq1": "ATGCRYSWKMBDHVNXU",
        "seq2": "ATGCGTACGT",
    }

    errors = strategy.find_genomic_validation_errors()

    assert errors == []


def test_find_genomic_validation_errors_finds_illegal_characters(strategy):
    strategy.sequences = {
        "seq1": "ATGC123",
        "seq2": "GCTA",
    }

    errors = strategy.find_genomic_validation_errors()

    assert len(errors) > 0
    assert "123" in errors or any("123" in err for err in errors)


def test_find_genomic_validation_errors_checks_all_sequences(strategy):
    strategy.sequences = {
        "seq1": "ATGC",
        "seq2": "GCTA123",
        "seq3": "TGCA",
    }

    errors = strategy.find_genomic_validation_errors()

    assert len(errors) > 0


def test_find_genomic_validation_errors_emits_error_on_exception(strategy, mocker):
    mock_sio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")
    strategy.sequences = {"seq1": None}  # This will cause an exception

    with pytest.raises(GenomicErrorException):
        strategy.find_genomic_validation_errors()

    assert mock_sio.emit.call_count >= 1
    
    mock_sio.emit.assert_called_with(
        "sequence_analysis_response",
        {"status": "error", "fasta_hash": "seq1"},
        to="viral_socket_789",
    )


def test_find_genomic_validation_errors_emits_error_for_all_sequences_on_exception(
    strategy, mocker
):
    mock_sio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")
    strategy.sequences = {"seq1": None, "seq2": None, "seq3": None}

    with pytest.raises(GenomicErrorException):
        strategy.find_genomic_validation_errors()

    assert mock_sio.emit.call_count == 3


### create_input_and_output_files ###


def test_create_input_and_output_files_creates_temp_directory(strategy, mocker):
    mock_mkdir = mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test.fa"
    mocker.patch("builtins.open", mock_open())
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_project_path", return_value="/test/path")

    strategy.create_input_and_output_files()

    mock_mkdir.assert_called_once_with(parents=True, exist_ok=True)


def test_create_input_and_output_files_creates_fasta_input_file(strategy, mocker):
    mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test.fa"
    mock_file = mock_open()
    mocker.patch("builtins.open", mock_file)
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_project_path", return_value="/test/path")

    strategy.fasta_content = ">seq1\nATGC"
    strategy.create_input_and_output_files()

    mock_file().write.assert_called_once_with(">seq1\nATGC")


def test_create_input_and_output_files_sets_input_path(strategy, mocker):
    mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test_file.fa"
    mocker.patch("builtins.open", mock_open())
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_project_path", return_value="/test/path")

    strategy.create_input_and_output_files()

    assert strategy.input == "/tmp/test_file.fa"


def test_create_input_and_output_files_sets_output_path_from_input(strategy, mocker):
    mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test.fa"
    mocker.patch("builtins.open", mock_open())
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_project_path", return_value="/test/path")

    strategy.create_input_and_output_files()

    assert strategy.output == "/tmp/test.json"


### run_analysis ###


def test_run_analysis_calls_script_with_correct_args(strategy, mocker):
    mock_subprocess = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.subprocess.run")
    mock_result = MagicMock()
    mock_result.returncode = 0
    mock_subprocess.return_value = mock_result
    mocker.patch("builtins.open", mock_open(read_data='{"errors": [], "results": []}'))
    mocker.patch("pathlib.Path.unlink")
    mock_get_script = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_script_path", return_value="/scripts/viral.sh")
    mock_get_scheme = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_pathogen_scheme_path", return_value="/schemes/sars")
    
    strategy.input = "/tmp/input.fa"
    strategy.output = "/tmp/output.json"

    strategy.run_analysis()

    mock_get_script.assert_called_once_with("viral")
    mock_get_scheme.assert_called_once_with(1)
    mock_subprocess.assert_called_once_with(
        ["/scripts/viral.sh", "/tmp/input.fa", "/tmp/output.json", "/schemes/sars"],
        check=False,
    )


def test_run_analysis_raises_exception_on_non_zero_return_code(strategy, mocker):
    mock_subprocess = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.subprocess.run")
    mock_result = MagicMock()
    mock_result.returncode = 1
    mock_subprocess.return_value = mock_result
    mock_unlink = mocker.patch("pathlib.Path.unlink")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_script_path", return_value="/scripts/viral.sh")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_pathogen_scheme_path", return_value="/schemes/sars")
    
    strategy.input = "/tmp/input.fa"
    strategy.output = "/tmp/output.json"

    with pytest.raises(SequenceAnalysisFailedException):
        strategy.run_analysis()

    assert mock_unlink.call_count == 2


def test_run_analysis_raises_exception_on_script_errors(strategy, mocker):
    mock_subprocess = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.subprocess.run")
    mock_result = MagicMock()
    mock_result.returncode = 0
    mock_subprocess.return_value = mock_result
    json_data = '{"errors": ["error1", "error2"], "results": []}'
    mocker.patch("builtins.open", mock_open(read_data=json_data))
    mocker.patch("pathlib.Path.unlink")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_script_path", return_value="/scripts/viral.sh")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_pathogen_scheme_path", return_value="/schemes/sars")
    
    strategy.input = "/tmp/input.fa"
    strategy.output = "/tmp/output.json"

    with pytest.raises(GenomicErrorException):
        strategy.run_analysis()


def test_run_analysis_returns_results_on_success(strategy, mocker):
    mock_subprocess = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.subprocess.run")
    mock_result = MagicMock()
    mock_result.returncode = 0
    mock_subprocess.return_value = mock_result
    results = [{"seqName": "seq1", "data": "test"}]
    json_data = json.dumps({"errors": [], "results": results})
    mocker.patch("builtins.open", mock_open(read_data=json_data))
    mocker.patch("pathlib.Path.unlink")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_script_path", return_value="/scripts/viral.sh")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_pathogen_scheme_path", return_value="/schemes/sars")
    
    strategy.input = "/tmp/input.fa"
    strategy.output = "/tmp/output.json"

    result = strategy.run_analysis()

    assert result == results


def test_run_analysis_deletes_temp_files_on_success(strategy, mocker):
    mock_subprocess = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.subprocess.run")
    mock_result = MagicMock()
    mock_result.returncode = 0
    mock_subprocess.return_value = mock_result
    mocker.patch("builtins.open", mock_open(read_data='{"errors": [], "results": []}'))
    mock_unlink = mocker.patch("pathlib.Path.unlink")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_script_path", return_value="/scripts/viral.sh")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_pathogen_scheme_path", return_value="/schemes/sars")
    
    strategy.input = "/tmp/input.fa"
    strategy.output = "/tmp/output.json"

    strategy.run_analysis()

    assert mock_unlink.call_count == 2


def test_run_analysis_deletes_temp_files_on_failure(strategy, mocker):
    mock_subprocess = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.subprocess.run")
    mock_result = MagicMock()
    mock_result.returncode = 1
    mock_subprocess.return_value = mock_result
    mock_unlink = mocker.patch("pathlib.Path.unlink")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_script_path", return_value="/scripts/viral.sh")
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.get_pathogen_scheme_path", return_value="/schemes/sars")
    
    strategy.input = "/tmp/input.fa"
    strategy.output = "/tmp/output.json"

    with pytest.raises(SequenceAnalysisFailedException):
        strategy.run_analysis()

    assert mock_unlink.call_count == 2


### get_response ###


def test_get_response_returns_tuple_with_fasta_hash_and_result(strategy, mocker):
    mock_p_open = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.popen", return_value=MagicMock(read=lambda: "nextclade 2.0.0\n"))
    
    result = {
        "seqName": "seq1",
        "clade": "20A",
        "customNodeAttributes": {},
        "totalMissing": 10,
        "substitutions": [],
        "deletions": [],
        "insertions": [],
        "missing": [],
        "nonACGTNs": [],
        "alignmentRange": {"start": 0, "end": 100},
    }
    strategy.sequences = {"seq1": "ATGCGTACGT"}

    response = strategy.get_response(result)

    assert isinstance(response, tuple)
    assert response[0] == "seq1"
    assert isinstance(response[1], dict)
    mock_p_open.assert_called_once_with("nextclade -V")

def test_get_response_includes_nextclade_version(strategy, mocker):
    mock_p_open = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.popen", return_value=MagicMock(read=lambda: "nextclade 2.5.0\n"))
    
    result = {
        "seqName": "seq1",
        "clade": "20A",
        "customNodeAttributes": {},
        "totalMissing": 10,
        "substitutions": [],
        "deletions": [],
        "insertions": [],
        "missing": [],
        "nonACGTNs": [],
        "alignmentRange": {"start": 0, "end": 100},
    }
    strategy.sequences = {"seq1": "ATGCGTACGT"}

    response = strategy.get_response(result)

    assert response[1]["nextclade_version"] == "2.5.0"
    mock_p_open.assert_called_once_with("nextclade -V")


def test_get_response_includes_lineage_with_pango(strategy, mocker):
    mock_p_open = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.popen", return_value=MagicMock(read=lambda: "nextclade 2.0.0\n"))
    
    result = {
        "seqName": "seq1",
        "clade": "20A",
        "customNodeAttributes": {"Nextclade_pango": "B.1.1.7"},
        "totalMissing": 10,
        "substitutions": [],
        "deletions": [],
        "insertions": [],
        "missing": [],
        "nonACGTNs": [],
        "alignmentRange": {"start": 0, "end": 100},
    }
    strategy.sequences = {"seq1": "ATGCGTACGT"}

    response = strategy.get_response(result)

    assert response[1]["lineage"] == "20A, B.1.1.7"
    mock_p_open.assert_called_once_with("nextclade -V")


def test_get_response_includes_lineage_without_pango(strategy, mocker):
    mock_p_open = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.popen", return_value=MagicMock(read=lambda: "nextclade 2.0.0\n"))
    
    result = {
        "seqName": "seq1",
        "clade": "20A",
        "customNodeAttributes": {},
        "totalMissing": 10,
        "substitutions": [],
        "deletions": [],
        "insertions": [],
        "missing": [],
        "nonACGTNs": [],
        "alignmentRange": {"start": 0, "end": 100},
    }
    strategy.sequences = {"seq1": "ATGCGTACGT"}

    response = strategy.get_response(result)

    assert response[1]["lineage"] == "20A"
    mock_p_open.assert_called_once_with("nextclade -V")


def test_get_response_handles_missing_clade(strategy, mocker):
    mock_p_open = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.popen", return_value=MagicMock(read=lambda: "nextclade 2.0.0\n"))
    
    result = {
        "seqName": "seq1",
        "customNodeAttributes": {},
        "totalMissing": 10,
        "substitutions": [],
        "deletions": [],
        "insertions": [],
        "missing": [],
        "nonACGTNs": [],
        "alignmentRange": {"start": 0, "end": 100},
    }
    strategy.sequences = {"seq1": "ATGCGTACGT"}

    response = strategy.get_response(result)

    assert response[1]["lineage"] is None
    mock_p_open.assert_called_once_with("nextclade -V")


def test_get_response_includes_sequence_length(strategy, mocker):
    mock_p_open = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.popen", return_value=MagicMock(read=lambda: "nextclade 2.0.0\n"))
    
    result = {
        "seqName": "seq1",
        "clade": "20A",
        "customNodeAttributes": {},
        "totalMissing": 10,
        "substitutions": [],
        "deletions": [],
        "insertions": [],
        "missing": [],
        "nonACGTNs": [],
        "alignmentRange": {"start": 0, "end": 100},
    }
    strategy.sequences = {"seq1": "ATGCGTACGTATGC"}

    response = strategy.get_response(result)

    assert response[1]["sequence_length"] == 14
    mock_p_open.assert_called_once_with("nextclade -V")


def test_get_response_includes_all_analysis_fields(strategy, mocker):
    mock_p_open = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.popen", return_value=MagicMock(read=lambda: "nextclade 2.0.0\n"))
    
    result = {
        "seqName": "seq1",
        "clade": "20A",
        "customNodeAttributes": {},
        "totalMissing": 15,
        "substitutions": ["A123T"],
        "deletions": ["100-110"],
        "insertions": ["200:ATG"],
        "missing": ["300-310"],
        "nonACGTNs": ["400"],
        "alignmentRange": {"start": 0, "end": 1000},
    }
    strategy.sequences = {"seq1": "ATGCGTACGT"}

    response = strategy.get_response(result)

    assert response[1]["n_count"] == 15
    assert response[1]["substitutions"] == ["A123T"]
    assert response[1]["deletions"] == ["100-110"]
    assert response[1]["insertions"] == ["200:ATG"]
    assert response[1]["missing"] == ["300-310"]
    assert response[1]["nonACGTNs"] == ["400"]
    assert response[1]["alignmentRange"] == {"start": 0, "end": 1000}
    mock_p_open.assert_called_once_with("nextclade -V")


### persist_and_emit_response ###


def test_persist_and_emit_response_processes_all_results(strategy, mocker):
    mock_get_response = mocker.patch.object(
        strategy, "get_response", side_effect=[
            ("hash1", {"data": "result1"}),
            ("hash2", {"data": "result2"}),
        ]
    )
    mock_persist = mocker.patch.object(strategy, "persist_result")
    mock_sio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")

    results = [{"seq": "1"}, {"seq": "2"}]
    strategy.persist_and_emit_response(results)

    assert mock_get_response.call_count == 2
    assert mock_persist.call_count == 2
    assert mock_sio.emit.call_count == 2


def test_persist_and_emit_response_persists_each_result(strategy, mocker):
    mocker.patch.object(
        strategy, "get_response", return_value=("hash1", {"data": "result1"})
    )
    mock_persist = mocker.patch.object(strategy, "persist_result")
    mocker.patch.object(strategy, "sio")

    results = [{"seq": "1"}]
    strategy.persist_and_emit_response(results)

    mock_persist.assert_called_once_with("hash1", {"data": "result1"})


def test_persist_and_emit_response_emits_success_event(strategy, mocker):
    mocker.patch.object(
        strategy, "get_response", return_value=("hash1", {"data": "result1"})
    )
    mocker.patch.object(strategy, "persist_result")
    mock_sio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")

    results = [{"seq": "1"}]
    strategy.persist_and_emit_response(results)

    mock_sio.emit.assert_called_once_with(
        "sequence_analysis_response",
        {"status": "success", "result": {"data": "result1"}, "fasta_hash": "hash1"},
        to="viral_socket_789",
    )


### emit_enqueued_event ###


def test_emit_enqueued_event_emits_for_all_sequences(strategy, mocker):
    mock_sio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mocker.patch("time.time", return_value=1234567890.0)

    strategy.emit_enqueued_event()

    assert mock_sio.emit.call_count == 2
    mock_sio.emit.assert_any_call(
        "sequence_analysis_enqueued", "seq1", to="viral_socket_789"
    )
    mock_sio.emit.assert_any_call(
        "sequence_analysis_enqueued", "seq2", to="viral_socket_789"
    )


def test_emit_enqueued_event_stores_timestamp_in_redis(strategy, mocker):
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mocker.patch("time.time", return_value=1234567890.0)

    strategy.emit_enqueued_event()

    assert mock_redis.hmset.call_count == 2
    mock_redis.hmset.assert_any_call(
        "client:sequence_analysis:seq1", {"enqueued_at": 1234567890.0}
    )
    mock_redis.hmset.assert_any_call(
        "client:sequence_analysis:seq2", {"enqueued_at": 1234567890.0}
    )


def test_emit_enqueued_event_sets_redis_expiration(strategy, mocker):
    mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mocker.patch("time.time", return_value=1234567890.0)

    strategy.emit_enqueued_event()

    assert mock_redis.expire.call_count == 2
    mock_redis.expire.assert_any_call(
        name="client:sequence_analysis:seq1", time=1800
    )
    mock_redis.expire.assert_any_call(
        name="client:sequence_analysis:seq2", time=1800
    )


### emit_started_event ###


def test_emit_started_event_emits_for_all_sequences(strategy, mocker):
    mock_sio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")

    strategy.emit_started_event()

    assert mock_sio.emit.call_count == 2
    mock_sio.emit.assert_any_call(
        "sequence_analysis_started", "seq1", to="viral_socket_789"
    )
    mock_sio.emit.assert_any_call(
        "sequence_analysis_started", "seq2", to="viral_socket_789"
    )


### emit_failed_event ###


def test_emit_failed_event_emits_error_for_all_sequences(strategy, mocker):
    mock_sio = mocker.patch("src.domains.sequence_analysis.strategies.viral_sequence_analysis.sio")

    strategy.emit_failed_event()

    assert mock_sio.emit.call_count == 2
    mock_sio.emit.assert_any_call(
        "sequence_analysis_response",
        {"status": "error", "fasta_hash": "seq1"},
        to="viral_socket_789",
    )
    mock_sio.emit.assert_any_call(
        "sequence_analysis_response",
        {"status": "error", "fasta_hash": "seq2"},
        to="viral_socket_789",
    )
