import pytest
from werkzeug.exceptions import UnprocessableEntity

from src.domains.sequence_analysis.controllers.sequence_analysis_controller import (
    get_sequence_analysis_result_action,
    delete_sequence_analysis_result_action,
    join_sequence_analysis_room_action,
    leave_sequence_analysis_room_action,
    init_sequence_analysis_action,
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
    mock_redis_connection.hgetall.return_value = {"some_key": "value"}
    with pytest.raises(UnprocessableEntity):
        get_sequence_analysis_result_action(":hash:")


def test_get_sequence_analysis_result_action_returns_none_if_result_not_available(
    app,
    mocker,
):
    with app.test_request_context():
        mock_redis_connection = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.redis_connection"
        )
        mock_redis_connection.hgetall.return_value = {"enqueued_at": "123456"}

        response = get_sequence_analysis_result_action("valid_hash")

        assert response.json is None


def test_get_sequence_analysis_result_action_returns_result_when_available(app, mocker):
    with app.test_request_context():
        mock_redis_connection = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.redis_connection"
        )
        result_data = {"status": "complete", "data": "analysis_result"}
        mock_redis_connection.hgetall.return_value = {
            "enqueued_at": "123456",
            "result": '{"status": "complete", "data": "analysis_result"}',
        }

        response = get_sequence_analysis_result_action("valid_hash")

        assert response.json == result_data


def test_get_sequence_analysis_result_action_deletes_hash_if_enqueued_at_missing(
    mocker,
):
    mock_redis_connection = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.redis_connection"
    )
    mock_redis_connection.hgetall.return_value = {"some_key": "value"}

    with pytest.raises(UnprocessableEntity):
        get_sequence_analysis_result_action("test_hash")

    mock_redis_connection.delete.assert_called_once_with(
        "client:sequence_analysis:test_hash"
    )


### delete_sequence_analysis_result_action ###


def test_delete_sequence_analysis_result_action_deletes_from_redis(app, mocker):
    with app.test_request_context():
        mock_redis_connection = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.redis_connection"
        )

        response = delete_sequence_analysis_result_action("test_hash")

        assert response.json == []
        mock_redis_connection.delete.assert_called_once_with(
            "client:sequence_analysis:test_hash"
        )


def test_delete_sequence_analysis_result_action_returns_empty_array(app, mocker):
    with app.test_request_context():
        mock_redis_connection = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.redis_connection"
        )

        response = delete_sequence_analysis_result_action("another_hash")

        assert response.json == []
        mock_redis_connection.delete.assert_called_once_with(
            "client:sequence_analysis:another_hash"
        )


### join_sequence_analysis_room_action ###


def test_join_sequence_analysis_room_action_joins_room_with_socket_id(app, mocker):
    with app.test_request_context():
        mock_join_room = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.join_room"
        )
        mock_sio = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.sio"
        )
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="test_socket_id")

        join_sequence_analysis_room_action("viral")

        mock_join_room.assert_called_once_with("viral_test_socket_id")
        mock_sio.emit.assert_called_once()


def test_join_sequence_analysis_room_action_emits_room_created_event(app, mocker):
    mock_join_room = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.join_room"
    )
    mock_sio = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.sio"
    )

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="test_socket_id")

        join_sequence_analysis_room_action("viral")

        mock_sio.emit.assert_called_once_with(
            "viral_room_created",
            "viral_test_socket_id",
            to="viral_test_socket_id",
        )
        mock_join_room.assert_called_once_with("viral_test_socket_id")


def test_join_sequence_analysis_room_action_handles_bacterial_pathogen_type(
    app, mocker
):
    mock_join_room = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.join_room"
    )
    mock_sio = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.sio"
    )

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="bacterial_socket")

        join_sequence_analysis_room_action("bacterial")

        mock_join_room.assert_called_once_with("bacterial_bacterial_socket")
        mock_sio.emit.assert_called_once_with(
            "bacterial_room_created",
            "bacterial_bacterial_socket",
            to="bacterial_bacterial_socket",
        )


### leave_sequence_analysis_room_action ###


def test_leave_sequence_analysis_room_action_leaves_room_with_socket_id(app, mocker):
    mock_leave_room = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.leave_room"
    )

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="test_socket_id")

        leave_sequence_analysis_room_action("viral")

        mock_leave_room.assert_called_once_with("viral_test_socket_id")


def test_leave_sequence_analysis_room_action_handles_bacterial_pathogen_type(
    app, mocker
):
    mock_leave_room = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.leave_room"
    )

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="bacterial_socket")

        leave_sequence_analysis_room_action("bacterial")

        mock_leave_room.assert_called_once_with("bacterial_bacterial_socket")


### init_sequence_analysis_action ###


def test_init_sequence_analysis_action_returns_early_if_pathogen_not_found(
    app, mocker, make_pathogen
):
    mock_pathogen_prisma = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = None
    mock_persist = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.persist_fasta_chunk"
    )

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="socket_123")

        result = init_sequence_analysis_action(
            ">seq1\nACGT", {"id": 0, "index": 0, "total": 1}, 999
        )

        assert result is None
        mock_persist.assert_not_called()


def test_init_sequence_analysis_action_removes_carriage_returns(
    app, mocker, make_pathogen
):
    pathogen = make_pathogen(pathogen_id=1, pathogen_type="viral")
    mock_pathogen_prisma = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_persist = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.persist_fasta_chunk"
    )
    mock_get_merged = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.get_merged_fasta_content_if_complete"
    )
    mock_get_merged.return_value = None

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="socket_123")

        init_sequence_analysis_action(
            ">seq1\r\nACGT\r\n", {"id": 0, "index": 0, "total": 1}, 1
        )

        # Check that persist_fasta_chunk was called with carriage returns removed
        call_args = mock_persist.call_args[0]
        assert "\r" not in call_args[0]


def test_init_sequence_analysis_action_pseudonymizes_bacterial_fasta_headers(
    app, mocker, make_pathogen
):
    pathogen = make_pathogen(pathogen_id=1, pathogen_type="bacterial")
    mock_pathogen_prisma = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_persist = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.persist_fasta_chunk"
    )
    mock_get_merged = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.get_merged_fasta_content_if_complete"
    )
    mock_get_merged.return_value = None

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="socket_123")

        init_sequence_analysis_action(
            ">some_id_12345\nACGT", {"id": 0, "index": 0, "total": 1}, 1
        )

        # Check that the header ID was removed
        call_args = mock_persist.call_args[0]
        assert call_args[0] == ">\nACGT"


def test_init_sequence_analysis_action_does_not_pseudonymize_viral_fasta_headers(
    app, mocker, make_pathogen
):
    pathogen = make_pathogen(pathogen_id=1, pathogen_type="viral")
    mock_pathogen_prisma = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_persist = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.persist_fasta_chunk"
    )
    mock_get_merged = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.get_merged_fasta_content_if_complete"
    )
    mock_get_merged.return_value = None

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="socket_123")

        init_sequence_analysis_action(
            ">some_id_12345\nACGT", {"id": 0, "index": 0, "total": 1}, 1
        )

        # Check that the header was not modified for viral
        call_args = mock_persist.call_args[0]
        assert call_args[0] == ">some_id_12345\nACGT"


def test_init_sequence_analysis_action_persists_fasta_chunk(app, mocker, make_pathogen):
    pathogen = make_pathogen(pathogen_id=1, pathogen_type="viral")
    mock_pathogen_prisma = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_persist = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.persist_fasta_chunk"
    )
    mock_get_merged = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.get_merged_fasta_content_if_complete"
    )
    mock_get_merged.return_value = None

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="socket_123")

        chunk_info = {"id": 0, "index": 0, "total": 1}
        init_sequence_analysis_action(">seq1\nACGT", chunk_info, 1)

        mock_persist.assert_called_once_with(">seq1\nACGT", "socket_123", chunk_info)


def test_init_sequence_analysis_action_returns_early_if_fasta_not_complete(
    app, mocker, make_pathogen
):
    pathogen = make_pathogen(pathogen_id=1, pathogen_type="viral")
    mock_pathogen_prisma = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_persist = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.persist_fasta_chunk"
    )
    mock_get_merged = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.get_merged_fasta_content_if_complete"
    )
    mock_get_merged.return_value = None
    mock_enqueue = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.enqueue_sequence_analysis_job"
    )

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="socket_123")

        init_sequence_analysis_action(
            ">seq1\nACGT", {"id": 0, "index": 0, "total": 2}, 1
        )
        mock_persist.assert_called_once_with(
            ">seq1\nACGT", "socket_123", {"id": 0, "index": 0, "total": 2}
        )
        mock_enqueue.assert_not_called()


def test_init_sequence_analysis_action_enqueues_job_when_fasta_complete(
    app, mocker, make_pathogen
):
    pathogen = make_pathogen(pathogen_id=1, pathogen_type="viral")
    mock_pathogen_prisma = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_persist = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.persist_fasta_chunk"
    )
    mock_get_merged = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.get_merged_fasta_content_if_complete"
    )
    mock_get_merged.return_value = ">seq1\nACGT\n>seq2\nGCTA"
    mock_enqueue = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.enqueue_sequence_analysis_job"
    )

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="socket_123")

        chunk_info = {"id": 0, "index": 1, "total": 2}
        fasta_hash = "test_hash_123"
        init_sequence_analysis_action(">seq2\nGCTA", chunk_info, 1, fasta_hash)

        mock_enqueue.assert_called_once_with(
            "socket_123", pathogen, ">seq1\nACGT\n>seq2\nGCTA", fasta_hash
        )
        mock_persist.assert_called_once_with(">seq2\nGCTA", "socket_123", chunk_info)


def test_init_sequence_analysis_action_enqueues_job_with_none_hash_if_not_provided(
    app, mocker, make_pathogen
):
    pathogen = make_pathogen(pathogen_id=1, pathogen_type="viral")
    mock_pathogen_prisma = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_persist = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.persist_fasta_chunk"
    )
    mock_get_merged = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.get_merged_fasta_content_if_complete"
    )
    mock_get_merged.return_value = ">seq1\nACGT"
    mock_enqueue = mocker.patch(
        "src.domains.sequence_analysis.controllers.sequence_analysis_controller.enqueue_sequence_analysis_job"
    )

    with app.test_request_context():
        mock_request = mocker.patch(
            "src.domains.sequence_analysis.controllers.sequence_analysis_controller.request"
        )
        type(mock_request).sid = mocker.PropertyMock(return_value="socket_123")

        chunk_info = {"id": 0, "index": 0, "total": 1}
        init_sequence_analysis_action(">seq1\nACGT", chunk_info, 1)

        mock_enqueue.assert_called_once_with(
            "socket_123", pathogen, ">seq1\nACGT", None
        )
        mock_persist.assert_called_once_with(">seq1\nACGT", "socket_123", chunk_info)
