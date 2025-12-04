import pytest
import time
from unittest.mock import MagicMock, mock_open, call
from src.domains.sequence_analysis.strategies.bacterial_sequence_analysis import (
    BacterialSequenceAnalysis,
    chewbacca_result_tsv_to_dict,
)
from src.domains.sequence_analysis.exceptions import (
    GenomicErrorException,
    SequenceAnalysisFailedException,
)


@pytest.fixture
def mock_pathogen(make_pathogen):
    return make_pathogen(pathogen_id=1, name="E. coli", pathogen_type="bacterial")


@pytest.fixture
def fasta_content():
    return ">contig1\nATGCGTACGTACGT\n>contig2\nGCTAGCTAGCTA"


@pytest.fixture
def strategy(mock_pathogen, fasta_content, mocker):
    return BacterialSequenceAnalysis(
        fasta_hash="test_hash_123",
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_456",
    )


### __init__ ###


def test_init_sets_type_to_bacterial(mock_pathogen, fasta_content):
    strategy = BacterialSequenceAnalysis(
        fasta_hash="hash_123",
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_789",
    )

    assert strategy.type == "bacterial"


def test_init_stores_fasta_hash(mock_pathogen, fasta_content):
    strategy = BacterialSequenceAnalysis(
        fasta_hash="my_hash_456",
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_789",
    )

    assert strategy.fasta_hash == "my_hash_456"


def test_init_calls_parent_init(mock_pathogen, fasta_content):
    strategy = BacterialSequenceAnalysis(
        fasta_hash="hash_123",
        pathogen=mock_pathogen,
        fasta_content=fasta_content,
        socket_id="socket_999",
    )

    assert strategy.pathogen == mock_pathogen
    assert strategy.fasta_content == fasta_content
    assert strategy.socket_id == "socket_999"


### find_genomic_validation_errors ###


def test_find_genomic_validation_errors_returns_empty_list_for_valid_sequences(
    strategy,
):
    strategy.fasta_content = ">\nATGCRYSWKMBDHVNXU\n>\nATGCGTACGT"

    errors = strategy.find_genomic_validation_errors()

    assert errors == []


def test_find_genomic_validation_errors_finds_illegal_characters(strategy):
    strategy.fasta_content = ">\nATGC123\n>\nGCTA"

    errors = strategy.find_genomic_validation_errors()

    assert len(errors) > 0
    assert "123" in errors


def test_find_genomic_validation_errors_detects_header_errors(strategy):
    strategy.fasta_content = ">contig1\nATGC\n>contig2\nGCTA"

    errors = strategy.find_genomic_validation_errors()

    # Headers contain text which is treated as illegal characters
    assert len(errors) == 2
    assert "contig1" in errors
    assert "contig2" in errors


def test_find_genomic_validation_errors_emits_error_on_exception(strategy, mocker):
    mock_sio = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )
    strategy.fasta_content = None  # This will cause an exception

    with pytest.raises(GenomicErrorException):
        strategy.find_genomic_validation_errors()

    mock_sio.emit.assert_called_once_with(
        "sequence_analysis_response",
        {"status": "error", "fasta_hash": "test_hash_123"},
        to="bacterial_socket_456",
    )


### index_sequences ###


def test_index_sequences_replaces_contig_names_with_numbers(strategy):
    strategy.fasta_content = ">contig1\nATGC\n>contig2\nGCTA\n>contig3\nTGCA"

    strategy.index_sequences()

    assert strategy.fasta_content == ">0contig1\nATGC\n>1contig2\nGCTA\n>2contig3\nTGCA"


def test_index_sequences_preserves_sequence_data(strategy):
    strategy.fasta_content = ">name\nATGCGTACGT"

    strategy.index_sequences()

    assert "ATGCGTACGT" in strategy.fasta_content


def test_index_sequences_handles_single_sequence(strategy):
    strategy.fasta_content = ">single\nATGC"

    strategy.index_sequences()

    assert strategy.fasta_content == ">0single\nATGC"


def test_index_sequences_handles_empty_content(strategy):
    strategy.fasta_content = ""

    strategy.index_sequences()

    assert strategy.fasta_content == ""


### create_input_and_output_files ###


def test_create_input_and_output_files_creates_directory(strategy, mocker):
    mock_mkdir = mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test.fa"
    mocker.patch("builtins.open", mock_open())
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_project_path",
        return_value="/test/path",
    )
    mocker.patch("time.time", return_value=1234567890.0)

    strategy.create_input_and_output_files()

    mock_mkdir.assert_called_once_with(parents=True, exist_ok=True)


def test_create_input_and_output_files_sets_input_path_with_timestamp(strategy, mocker):
    mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test.fa"
    mocker.patch("builtins.open", mock_open())
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_project_path",
        return_value="/test/path",
    )
    mocker.patch("time.time", return_value=1234567890.123)

    strategy.create_input_and_output_files()

    assert strategy.input == "/test/path/temp_data/sequence_analysis/test_hash_123_1234567890123/"


def test_create_input_and_output_files_creates_fasta_file(strategy, mocker):
    mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test.fa"
    mock_file = mock_open()
    mocker.patch("builtins.open", mock_file)
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_project_path",
        return_value="/test/path",
    )
    mocker.patch("time.time", return_value=1234567890.0)
    mock_index = mocker.patch.object(strategy, "index_sequences")

    strategy.fasta_content = ">seq1\nATGC"
    strategy.create_input_and_output_files()

    mock_index.assert_called_once()
    mock_file().write.assert_called_once_with(">seq1\nATGC")


def test_create_input_and_output_files_sets_output_path_with_timestamp(strategy, mocker):
    mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test.fa"
    mocker.patch("builtins.open", mock_open())
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_project_path",
        return_value="/test/path",
    )
    mocker.patch("time.time", return_value=1234567890.456)

    strategy.create_input_and_output_files()

    assert strategy.output == "/test/path/temp_data/sequence_analysis/outputs/test_hash_123_1234567890456"


def test_create_input_and_output_files_calls_index_sequences(strategy, mocker):
    mocker.patch("pathlib.Path.mkdir")
    mock_temp = mocker.patch("tempfile.NamedTemporaryFile")
    mock_temp.return_value.name = "/tmp/test.fa"
    mocker.patch("builtins.open", mock_open())
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_project_path",
        return_value="/test/path",
    )
    mocker.patch("time.time", return_value=1234567890.0)
    mock_index = mocker.patch.object(strategy, "index_sequences")

    strategy.create_input_and_output_files()

    mock_index.assert_called_once()


### get_first_contig_length ###


def test_get_first_contig_length_returns_length_of_first_contig(strategy):
    strategy.fasta_content = ">0\nATGCGTACGT\n>1\nGCTA"

    length = strategy.get_first_contig_length()

    assert length == 10


def test_get_first_contig_length_handles_newlines_in_sequence(strategy):
    strategy.fasta_content = ">0\nATGC\nGTAC\nGT\n>1\nGCTA"

    length = strategy.get_first_contig_length()

    assert length == 10


def test_get_first_contig_length_stops_at_second_contig(strategy):
    strategy.fasta_content = ">0\nATGC\n>1\nGCTAGCTAGCTAGCTA"

    length = strategy.get_first_contig_length()

    assert length == 4


def test_get_first_contig_length_handles_single_contig(strategy):
    strategy.fasta_content = ">0\nATGCGTACGTACGTACGT"

    length = strategy.get_first_contig_length()

    assert length == 18


### run_analysis ###


def test_run_analysis_checks_redis_cache_first(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mock_redis.hgetall.return_value = {"result": '{"data": "cached"}'}

    result = strategy.run_analysis()

    mock_redis.hgetall.assert_called_once_with("client:sequence_analysis:test_hash_123")
    assert result == '{"data": "cached"}'


def test_run_analysis_calls_perl_script_with_correct_args(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mock_redis.hgetall.return_value = {}
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.Popen"
    )
    mock_process = MagicMock()
    mock_process.returncode = 0
    mock_popen.return_value = mock_process
    mock_open_func = mock_open(read_data="FILE\tgene1\tgene2\nseq.fa\tallele1\tallele2")
    mocker.patch("builtins.open", mock_open_func)
    mocker.patch("shutil.rmtree")
    mock_sys = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sys"
    )
    mock_get_script = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_script_path",
        return_value="/scripts/bacterial.pl",
    )
    mock_get_scheme = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_pathogen_scheme_path",
        return_value="/schemes/ecoli",
    )

    strategy.input = "/tmp/input/"
    strategy.output = "/tmp/output"
    strategy.fasta_content = ">0\nATGC"

    strategy.run_analysis()

    mock_get_script.assert_called_once_with("bacterial")
    mock_get_scheme.assert_called_once_with(1)
    mock_popen.assert_called_once_with(
        [
            "perl",
            "/scripts/bacterial.pl",
            "-input",
            "/tmp/input/",
            "-scheme",
            "/schemes/ecoli",
            "-output",
            "/tmp/output",
        ],
        stdout=mock_sys.stdout,
    )


def test_run_analysis_raises_exception_on_non_zero_return_code(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mock_redis.hgetall.return_value = {}
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.Popen"
    )
    mock_process = MagicMock()
    mock_process.returncode = 1
    mock_popen.return_value = mock_process
    mock_rmtree = mocker.patch("shutil.rmtree")
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sys"
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_script_path",
        return_value="/scripts/bacterial.pl",
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_pathogen_scheme_path",
        return_value="/schemes/ecoli",
    )

    strategy.input = "/tmp/input/"
    strategy.output = "/tmp/output"

    with pytest.raises(SequenceAnalysisFailedException):
        strategy.run_analysis()

    mock_rmtree.assert_called_once_with("/tmp/input/")


def test_run_analysis_reads_tsv_files_on_success(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mock_redis.hgetall.return_value = {}
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.Popen"
    )
    mock_process = MagicMock()
    mock_process.returncode = 0
    mock_popen.return_value = mock_process
    
    tsv_content = "FILE\tgene1\tgene2\nseq.fa\tallele1\tallele2"
    mock_open_func = mock_open(read_data=tsv_content)
    mocker.patch("builtins.open", mock_open_func)
    mocker.patch("shutil.rmtree")
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sys"
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_script_path",
        return_value="/scripts/bacterial.pl",
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_pathogen_scheme_path",
        return_value="/schemes/ecoli",
    )

    strategy.input = "/tmp/input/"
    strategy.output = "/tmp/output"
    strategy.fasta_content = ">0\nATGC"

    result = strategy.run_analysis()

    assert "allele_hashes" in result
    assert "allele_ids" in result


def test_run_analysis_calculates_undeterminable_gen_count(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mock_redis.hgetall.return_value = {}
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.Popen"
    )
    mock_process = MagicMock()
    mock_process.returncode = 0
    mock_popen.return_value = mock_process
    
    tsv_content = "FILE\tgene1\tgene2\tgene3\nseq.fa\t-\tallele2\t-"
    mock_open_func = mock_open(read_data=tsv_content)
    mocker.patch("builtins.open", mock_open_func)
    mocker.patch("shutil.rmtree")
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sys"
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_script_path",
        return_value="/scripts/bacterial.pl",
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_pathogen_scheme_path",
        return_value="/schemes/ecoli",
    )

    strategy.input = "/tmp/input/"
    strategy.output = "/tmp/output"
    strategy.fasta_content = ">0\nATGC\n>1\nGCTA"

    result = strategy.run_analysis()

    assert result["undeterminable_gen_count"] == 2


def test_run_analysis_counts_contigs(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mock_redis.hgetall.return_value = {}
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.Popen"
    )
    mock_process = MagicMock()
    mock_process.returncode = 0
    mock_popen.return_value = mock_process
    
    tsv_content = "FILE\tgene1\nseq.fa\tallele1"
    mock_open_func = mock_open(read_data=tsv_content)
    mocker.patch("builtins.open", mock_open_func)
    mocker.patch("shutil.rmtree")
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sys"
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_script_path",
        return_value="/scripts/bacterial.pl",
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_pathogen_scheme_path",
        return_value="/schemes/ecoli",
    )

    strategy.input = "/tmp/input/"
    strategy.output = "/tmp/output"
    strategy.fasta_content = ">0\nATGC\n>1\nGCTA\n>2\nTGCA"

    result = strategy.run_analysis()

    assert result["contig_count"] == 3


def test_run_analysis_gets_first_contig_length(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mock_redis.hgetall.return_value = {}
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.Popen"
    )
    mock_process = MagicMock()
    mock_process.returncode = 0
    mock_popen.return_value = mock_process
    
    tsv_content = "FILE\tgene1\nseq.fa\tallele1"
    mock_open_func = mock_open(read_data=tsv_content)
    mocker.patch("builtins.open", mock_open_func)
    mocker.patch("shutil.rmtree")
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sys"
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_script_path",
        return_value="/scripts/bacterial.pl",
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_pathogen_scheme_path",
        return_value="/schemes/ecoli",
    )
    mock_get_length = mocker.patch.object(strategy, "get_first_contig_length", return_value=1000)

    strategy.input = "/tmp/input/"
    strategy.output = "/tmp/output"
    strategy.fasta_content = ">0\nATGC"

    result = strategy.run_analysis()

    mock_get_length.assert_called_once()
    assert result["first_contig_length"] == 1000


def test_run_analysis_deletes_temp_directories_on_success(strategy, mocker):
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mock_redis.hgetall.return_value = {}
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.Popen"
    )
    mock_process = MagicMock()
    mock_process.returncode = 0
    mock_popen.return_value = mock_process
    
    tsv_content = "FILE\tgene1\nseq.fa\tallele1"
    mock_open_func = mock_open(read_data=tsv_content)
    mocker.patch("builtins.open", mock_open_func)
    mock_rmtree = mocker.patch("shutil.rmtree")
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sys"
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_script_path",
        return_value="/scripts/bacterial.pl",
    )
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.get_pathogen_scheme_path",
        return_value="/schemes/ecoli",
    )

    strategy.input = "/tmp/input/"
    strategy.output = "/tmp/output"
    strategy.fasta_content = ">0\nATGC"

    strategy.run_analysis()

    assert mock_rmtree.call_count == 2
    mock_rmtree.assert_any_call("/tmp/input/")
    mock_rmtree.assert_any_call("/tmp/output")


### get_response ###


def test_get_response_returns_dict(strategy, mocker):
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.popen",
        return_value=MagicMock(read=lambda: "chewBBACA version: 3.3.0\n"),
    )

    result = {
        "allele_ids": {"gene1": "1", "gene2": "2"},
        "allele_hashes": {"gene1": "hash1", "gene2": "hash2"},
        "undeterminable_gen_count": 0,
        "contig_count": 2,
        "first_contig_length": 5000,
    }

    response = strategy.get_response(result)

    assert isinstance(response, dict)
    mock_popen.assert_called_once_with("chewBBACA.py -v")


def test_get_response_includes_chewbbacca_version(strategy, mocker):
    mock_popen = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.popen",
        return_value=MagicMock(read=lambda: "chewBBACA version: 3.3.5\n"),
    )

    result = {
        "allele_ids": {},
        "allele_hashes": {},
        "undeterminable_gen_count": 0,
        "contig_count": 1,
        "first_contig_length": 1000,
    }

    response = strategy.get_response(result)

    assert response["chewBACCA_version"] == "3.3.5"
    mock_popen.assert_called_once_with("chewBBACA.py -v")


def test_get_response_includes_analysis_schema(strategy, mocker):
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.popen",
        return_value=MagicMock(read=lambda: "chewBBACA version: 3.3.0\n"),
    )

    result = {
        "allele_ids": {},
        "allele_hashes": {},
        "undeterminable_gen_count": 0,
        "contig_count": 1,
        "first_contig_length": 1000,
    }

    response = strategy.get_response(result)

    assert "analysis_schema" in response


def test_get_response_includes_all_result_fields(strategy, mocker):
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.popen",
        return_value=MagicMock(read=lambda: "chewBBACA version: 3.3.0\n"),
    )

    result = {
        "allele_ids": {"gene1": "10", "gene2": "20"},
        "allele_hashes": {"gene1": "abc123", "gene2": "def456"},
        "undeterminable_gen_count": 5,
        "contig_count": 15,
        "first_contig_length": 12345,
    }

    response = strategy.get_response(result)

    assert response["allele_ids"] == {"gene1": "10", "gene2": "20"}
    assert response["allele_hashes"] == {"gene1": "abc123", "gene2": "def456"}
    assert response["undeterminable_gen_count"] == 5
    assert response["contig_count"] == 15
    assert response["first_contig_length"] == 12345


### persist_and_emit_response ###


def test_persist_and_emit_response_calls_get_response(strategy, mocker):
    mock_get_response = mocker.patch.object(
        strategy, "get_response", return_value={"data": "result"}
    )
    mocker.patch.object(strategy, "persist_result")
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )

    result = {"test": "data"}
    strategy.persist_and_emit_response(result)

    mock_get_response.assert_called_once_with(result)


def test_persist_and_emit_response_persists_result(strategy, mocker):
    mocker.patch.object(strategy, "get_response", return_value={"data": "result"})
    mock_persist = mocker.patch.object(strategy, "persist_result")
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )

    result = {"test": "data"}
    strategy.persist_and_emit_response(result)

    mock_persist.assert_called_once_with("test_hash_123", {"data": "result"})


def test_persist_and_emit_response_emits_success_event(strategy, mocker):
    mocker.patch.object(strategy, "get_response", return_value={"data": "result"})
    mocker.patch.object(strategy, "persist_result")
    mock_sio = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )

    result = {"test": "data"}
    strategy.persist_and_emit_response(result)

    mock_sio.emit.assert_called_once_with(
        "sequence_analysis_response",
        {
            "status": "success",
            "result": {"data": "result"},
            "fasta_hash": "test_hash_123",
        },
        to="bacterial_socket_456",
    )


### emit_enqueued_event ###


def test_emit_enqueued_event_emits_to_socket(strategy, mocker):
    mock_sio = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mocker.patch("time.time", return_value=1234567890.0)

    strategy.emit_enqueued_event()

    mock_sio.emit.assert_called_once_with(
        "sequence_analysis_enqueued", "test_hash_123", to="bacterial_socket_456"
    )


def test_emit_enqueued_event_stores_timestamp_in_redis(strategy, mocker):
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mocker.patch("time.time", return_value=1234567890.0)

    strategy.emit_enqueued_event()

    mock_redis.hmset.assert_called_once_with(
        "client:sequence_analysis:test_hash_123", {"enqueued_at": 1234567890.0}
    )


def test_emit_enqueued_event_sets_redis_expiration(strategy, mocker):
    mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )
    mock_redis = mocker.patch.object(strategy, "redis_connection")
    mocker.patch("time.time", return_value=1234567890.0)

    strategy.emit_enqueued_event()

    mock_redis.expire.assert_called_once_with(
        name="client:sequence_analysis:test_hash_123", time=1800
    )


### emit_started_event ###


def test_emit_started_event_emits_to_socket(strategy, mocker):
    mock_sio = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )

    strategy.emit_started_event()

    mock_sio.emit.assert_called_once_with(
        "sequence_analysis_started", "test_hash_123", to="bacterial_socket_456"
    )


### emit_failed_event ###


def test_emit_failed_event_emits_error_to_socket(strategy, mocker):
    mock_sio = mocker.patch(
        "src.domains.sequence_analysis.strategies.bacterial_sequence_analysis.sio"
    )

    strategy.emit_failed_event()

    mock_sio.emit.assert_called_once_with(
        "sequence_analysis_response",
        {"status": "error", "fasta_hash": "test_hash_123"},
        to="bacterial_socket_456",
    )


### chewbacca_result_tsv_to_dict ###


def test_chewbacca_result_tsv_to_dict_parses_tsv_file():
    from io import StringIO

    tsv_content = "FILE\tgene1\tgene2\tgene3\nseq.fa\tallele1\tallele2\tallele3"
    file = StringIO(tsv_content)

    result = chewbacca_result_tsv_to_dict(file)

    assert result == {"gene1": "allele1", "gene2": "allele2", "gene3": "allele3"}


def test_chewbacca_result_tsv_to_dict_skips_file_column():
    from io import StringIO

    tsv_content = "FILE\tgene1\tgene2\nseq.fa\tallele1\tallele2"
    file = StringIO(tsv_content)

    result = chewbacca_result_tsv_to_dict(file)

    assert "FILE" not in result


def test_chewbacca_result_tsv_to_dict_strips_whitespace():
    from io import StringIO

    tsv_content = "FILE\tgene1\tgene2  \nseq.fa\tallele1  \tallele2  "
    file = StringIO(tsv_content)

    result = chewbacca_result_tsv_to_dict(file)

    assert result == {"gene1": "allele1", "gene2": "allele2"}


def test_chewbacca_result_tsv_to_dict_handles_empty_values():
    from io import StringIO

    tsv_content = "FILE\tgene1\tgene2\nseq.fa\t\tallele2"
    file = StringIO(tsv_content)

    result = chewbacca_result_tsv_to_dict(file)

    assert result == {"gene1": "", "gene2": "allele2"}


def test_chewbacca_result_tsv_to_dict_handles_single_gene():
    from io import StringIO

    tsv_content = "FILE\tgene1\nseq.fa\tallele1"
    file = StringIO(tsv_content)

    result = chewbacca_result_tsv_to_dict(file)

    assert result == {"gene1": "allele1"}
