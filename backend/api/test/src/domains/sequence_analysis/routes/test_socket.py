import pytest
from src.domains.sequence_analysis.routes.socket import join_sequence_analysis_room
from src.domains.sequence_analysis.routes.socket import leave_sequence_analysis_room
from src.domains.sequence_analysis.routes.socket import init_sequence_analysis


### join_sequence_analysis_room ###


def test_join_sequence_analysis_room_calls_join_action(mocker):
    """Test that join_sequence_analysis_room event calls the controller action"""
    mock_join_action = mocker.patch(
        "src.domains.sequence_analysis.routes.socket.join_sequence_analysis_room_action"
    )
    
    
    pathogen_type = "viral"
    join_sequence_analysis_room(pathogen_type)
    
    mock_join_action.assert_called_once_with(pathogen_type)


def test_join_sequence_analysis_room_passes_pathogen_type_correctly(mocker):
    """Test that join_sequence_analysis_room passes the correct pathogen_type"""
    mock_join_action = mocker.patch(
        "src.domains.sequence_analysis.routes.socket.join_sequence_analysis_room_action"
    )
    
    
    pathogen_type = "bacterial"
    join_sequence_analysis_room(pathogen_type)
    
    mock_join_action.assert_called_once_with(pathogen_type)


### leave_sequence_analysis_room ###


def test_leave_sequence_analysis_room_calls_leave_action(mocker):
    """Test that leave_sequence_analysis_room event calls the controller action"""
    mock_leave_action = mocker.patch(
        "src.domains.sequence_analysis.routes.socket.leave_sequence_analysis_room_action"
    )
    
    
    pathogen_type = "viral"
    leave_sequence_analysis_room(pathogen_type)
    
    mock_leave_action.assert_called_once_with(pathogen_type)


def test_leave_sequence_analysis_room_passes_pathogen_type_correctly(mocker):
    """Test that leave_sequence_analysis_room passes the correct pathogen_type"""
    mock_leave_action = mocker.patch(
        "src.domains.sequence_analysis.routes.socket.leave_sequence_analysis_room_action"
    )
    
    
    pathogen_type = "bacterial"
    leave_sequence_analysis_room(pathogen_type)
    
    mock_leave_action.assert_called_once_with(pathogen_type)


### init_sequence_analysis ###


def test_init_sequence_analysis_calls_init_action_with_all_parameters(mocker):
    """Test that init_sequence_analysis event calls the controller action with all parameters"""
    mock_init_action = mocker.patch(
        "src.domains.sequence_analysis.routes.socket.init_sequence_analysis_action"
    )
    
    
    fasta_chunk = ">sequence1\nACGTACGT"
    chunk_information = {"id": 0, "index": 0, "total": 1}
    pathogen_id = 123
    fasta_hash = "abc123def456"
    
    init_sequence_analysis(fasta_chunk, chunk_information, pathogen_id, fasta_hash)
    
    mock_init_action.assert_called_once_with(
        fasta_chunk, chunk_information, pathogen_id, fasta_hash
    )


def test_init_sequence_analysis_calls_init_action_without_optional_fasta_hash(mocker):
    """Test that init_sequence_analysis works without the optional fasta_hash parameter"""
    mock_init_action = mocker.patch(
        "src.domains.sequence_analysis.routes.socket.init_sequence_analysis_action"
    )
    
    
    fasta_chunk = ">sequence1\nACGTACGT"
    chunk_information = {"id": 0, "index": 0, "total": 1}
    pathogen_id = 123
    
    init_sequence_analysis(fasta_chunk, chunk_information, pathogen_id)
    
    mock_init_action.assert_called_once_with(
        fasta_chunk, chunk_information, pathogen_id, None
    )


def test_init_sequence_analysis_handles_multiple_chunks(mocker):
    """Test that init_sequence_analysis handles multiple chunk transfers correctly"""
    mock_init_action = mocker.patch(
        "src.domains.sequence_analysis.routes.socket.init_sequence_analysis_action"
    )
    
    
    # Simulate receiving multiple chunks
    chunks = [
        (">seq1\nACGT", {"id": 0, "index": 0, "total": 3}),
        (">seq2\nGCTA", {"id": 0, "index": 1, "total": 3}),
        (">seq3\nTACG", {"id": 0, "index": 2, "total": 3}),
    ]
    pathogen_id = 456
    fasta_hash = "test_hash"
    
    for chunk, info in chunks:
        init_sequence_analysis(chunk, info, pathogen_id, fasta_hash)
    
    assert mock_init_action.call_count == 3
    
    # Verify each call
    calls = mock_init_action.call_args_list
    for i, (chunk, info) in enumerate(chunks):
        assert calls[i][0] == (chunk, info, pathogen_id, fasta_hash)


def test_init_sequence_analysis_handles_empty_fasta_chunk(mocker):
    """Test that init_sequence_analysis handles empty fasta chunks"""
    mock_init_action = mocker.patch(
        "src.domains.sequence_analysis.routes.socket.init_sequence_analysis_action"
    )
    
    
    fasta_chunk = ""
    chunk_information = {"id": 0, "index": 0, "total": 1}
    pathogen_id = 789
    
    init_sequence_analysis(fasta_chunk, chunk_information, pathogen_id)
    
    mock_init_action.assert_called_once_with(
        fasta_chunk, chunk_information, pathogen_id, None
    )
