import pytest
import fakeredis
from src.domains.sequence_analysis.redis_actions import persist_fasta_chunk
import src.domains.sequence_analysis.redis_actions as redis_actions


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