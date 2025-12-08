import datetime
import pytest
import fakeredis

from src.domains.pathogen_registry.resources.pathogen import Pathogen
from src.domains.sequence_analysis.redis_actions import (
    enqueue_sequence_analysis_job,
    get_merged_fasta_content_if_complete,
    persist_fasta_chunk,
)
import src.domains.sequence_analysis.redis_actions as redis_actions
from src.server import queue_viral, queue_bacterial


@pytest.fixture(autouse=True)
def fake_redis(monkeypatch):
    fake = fakeredis.FakeRedis(decode_responses=True)
    monkeypatch.setattr(redis_actions, "redis_connection", fake)
    return fake


### GenomicErrorException ###


def test_persist_fasta_chunk_chaches_content():
    persist_fasta_chunk("fasta_chunk", "socket_id", {"id": 0, "index": 0})
    assert redis_actions.redis_connection.get("chunks:socket_id:0:0") == "fasta_chunk"


def test_persist_fasta_chunk_chaches_with_TLL_60():
    persist_fasta_chunk("fasta_chunk", "socket_id", {"id": 0, "index": 0})
    assert redis_actions.redis_connection.ttl("chunks:socket_id:0:0") == 60


def test_get_persisted_fasta_chunk_keys_returns_all_keys(mocker):
    mock_redis_connection = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection",
    )
    mock_redis_connection.keys.return_value = [
        "chunks:socket_id:0:0",
        "chunks:socket_id:0:1",
    ]
    keys = redis_actions.get_persisted_fasta_chunk_keys("socket_id", {"id": 0})
    assert keys == ["chunks:socket_id:0:0", "chunks:socket_id:0:1"]


def test_get_persisted_fasta_chunk_keys_returns_keys_in_correct_order(mocker):
    mock_redis_connection = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection",
    )
    mock_redis_connection.keys.return_value = [
        "chunks:socket_id:0:1",
        "chunks:socket_id:0:0",
    ]
    keys = redis_actions.get_persisted_fasta_chunk_keys("socket_id", {"id": 0})
    assert keys == ["chunks:socket_id:0:0", "chunks:socket_id:0:1"]


def test_get_persisted_fasta_chunk_keys_returns_empty_list_if_entry_does_not_exist(
    mocker,
):
    mock_redis_connection = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection",
    )
    mock_redis_connection.keys.return_value = []
    keys = redis_actions.get_persisted_fasta_chunk_keys("not_existing_key", {"id": 0})
    assert keys == []
    mock_redis_connection.keys.assert_called_once_with("chunks:not_existing_key:0:*")


def test_get_merged_fasta_content_if_complete_returns_none_if_not_complete(mocker):
    mock = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection.keys",
        return_value=[
            "chunks:socket_id:0:0",
        ],
    )
    response = get_merged_fasta_content_if_complete(
        "socket_id", {"id": 0, "index": 0, "total": 2}
    )
    assert response is None
    mock.assert_called_once_with("chunks:socket_id:0:*")


def test_get_merged_fasta_content_if_complete_returns_merged_strings_in_correct_order(
    mocker,
):
    def fake_get(x):
        if x == "chunks:socket_id:0:0":
            return ":first_sequence:"
        elif x == "chunks:socket_id:0:1":
            return ":second_sequence:"
        else:
            return None

    mock_keys = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection.keys",
        return_value=[
            "chunks:socket_id:0:0",
            "chunks:socket_id:0:1",
        ],
    )

    mock_get = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection.get",
        side_effect=fake_get,
    )
    response = get_merged_fasta_content_if_complete(
        "socket_id", {"id": 0, "index": 0, "total": 2}
    )

    assert response == ":first_sequence::second_sequence:"
    mock_keys.assert_called_once()
    mock_get.assert_any_call("chunks:socket_id:0:0")
    mock_get.assert_any_call("chunks:socket_id:0:1")


def test_get_merged_fasta_content_if_complete_returns_none_if_a_fasta_chunk_is_none(
    mocker,
):
    def fake_get(x):
        if x == "chunks:socket_id:0:0":
            return ":first_sequence:"
        elif x == "chunks:socket_id:0:1":
            return None
        else:
            return None

    mock_keys = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection.keys",
        return_value=[
            "chunks:socket_id:0:0",
            "chunks:socket_id:0:1",
        ],
    )

    mock_get = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection.get",
        side_effect=fake_get,
    )
    response = get_merged_fasta_content_if_complete(
        "socket_id", {"id": 0, "index": 0, "total": 2}
    )

    assert response == None
    mock_keys.assert_called_once()
    mock_get.assert_any_call("chunks:socket_id:0:0")
    mock_get.assert_any_call("chunks:socket_id:0:1")


def test_get_merged_fasta_content_if_complete_deletes_chunks_from_redis(
    mocker,
):

    mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection.keys",
        return_value=[
            "chunks:socket_id:0:0",
            "chunks:socket_id:0:1",
        ],
    )

    mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection.get",
        return_value=":sequence:",
    )
    mock_delete = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.redis_connection.delete",
    )
    get_merged_fasta_content_if_complete("socket_id", {"id": 0, "index": 0, "total": 2})

    mock_delete.assert_any_call("chunks:socket_id:0:0")
    mock_delete.assert_any_call("chunks:socket_id:0:1")


def test_enqueue_sequence_analysis_job_uses_viral_strategy_and_queue_for_viral_pathogen(
    mocker,
):
    pathogen = Pathogen(
        id=1,
        name=":pathogen:",
        type="viral",
        activated=True,
        scheme_version=datetime.datetime.now(),
        genetic_distance_threshold=1,
    )
    mock_enqueue_analysis = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.ViralSequenceAnalysis.enqueue_analysis"
    )
    enqueue_sequence_analysis_job(
        "socket_id", pathogen, "fasta_content", fasta_hash=None
    )
    mock_enqueue_analysis.assert_called_once_with(queue_viral)


def test_enqueue_sequence_analysis_job_uses_bacterial_strategy_and_queue_for_bacterial_pathogen(
    mocker,
):
    pathogen = Pathogen(
        id=1,
        name=":pathogen:",
        type="bacterial",
        activated=True,
        scheme_version=datetime.datetime.now(),
        genetic_distance_threshold=1,
    )
    mock_enqueue_analysis = mocker.patch(
        "src.domains.sequence_analysis.redis_actions.BacterialSequenceAnalysis.enqueue_analysis"
    )
    enqueue_sequence_analysis_job(
        "socket_id", pathogen, "fasta_content", fasta_hash=None
    )
    mock_enqueue_analysis.assert_called_once_with(queue_bacterial)
