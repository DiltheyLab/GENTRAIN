from flask import jsonify
from src.domains.sequence_analysis.routes.api import (
    align_sequences,
    delete_sequence_analysis_result,
    get_sequence_analysis_result,
)


def test_get_sequence_analysis_result_endpoint_returns_action_result(mocker):
    mock_action = mocker.patch(
        "src.domains.sequence_analysis.routes.api.get_sequence_analysis_result_action",
        return_value="test_result",
    )
    response = get_sequence_analysis_result("fasta_hash")
    assert response == "test_result"
    mock_action.assert_called_once_with("fasta_hash")


def test_delete_sequence_analysis_result_endpoint_returns_action_result(mocker):
    mock_action = mocker.patch(
        "src.domains.sequence_analysis.routes.api.delete_sequence_analysis_result_action",
        return_value=[],
    )
    response = delete_sequence_analysis_result("fasta_hash")
    assert response == []
    mock_action.assert_called_once_with("fasta_hash")
