import pytest
from werkzeug.exceptions import UnprocessableEntity

from src.domains.sequence_analysis.controllers.sequence_analysis_controller import (
    get_sequence_analysis_result_action,
)

### get_sequence_analysis_result_action ###


def test_get_sequence_analysis_result_action_returns_unprocessable_entity_for_non_existing_hash():
    with pytest.raises(UnprocessableEntity):
        get_sequence_analysis_result_action(":invalid_hash:")


def test_get_sequence_analysis_result_action_returns_unprocessable_entity_if_enqueued_at_timestamp_is_missing(
    mocker,
):
    mock_redis_connection = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.redis_connection"
    )
    mock_redis_connection.hgetall.result = {}
    with pytest.raises(UnprocessableEntity):
        get_sequence_analysis_result_action(":hash:")
