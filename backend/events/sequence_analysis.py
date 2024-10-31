import json
import re
from flask import request
from flask_socketio import leave_room, join_room
from backend.server import sio, redis_connection, queue_viral, queue_bacterial
from backend.strategies.pathogen_strategy_manager import PathogenStrategyManager
from backend.admin.models import Pathogen


@sio.event
def sequence_analysis_request(pathogen_id, fasta_id, sequence_chunk, chunk_information):
    pathogen = Pathogen.query.get(pathogen_id)
    socket_id = request.sid
    # validate sequence before persisting
    sequence_chunk = sequence_chunk.replace("\r", "")
    sequence_chunk = re.sub(r"\>(.*?)\n", ">\n", sequence_chunk)
    genetic_errors = get_genetic_errors(sequence_chunk)
    if len(genetic_errors) > 0:
        sio.emit(
            event="sequence_analysis_failed",
            data=fasta_id,
            to=f"{pathogen.type}_{socket_id}",
        )
        return
    persist_sequence_chunk(sequence_chunk, chunk_information, socket_id, fasta_id)
    chunk_keys = get_persisted_sequence_chunk_keys(socket_id, fasta_id)
    if chunk_information["total"] > len(chunk_keys):
        return
    sequence = ""
    for key in chunk_keys:
        sequence += redis_connection.get(key)
        redis_connection.delete(key)
    strategy = PathogenStrategyManager.get_sequence_analysis_strategy(
        pathogen=pathogen,
        fasta_id=fasta_id,
        sequence=sequence,
        socket_id=socket_id,
    )
    strategy.enqueue_analysis(
        queue_viral if strategy.type == "viral" else queue_bacterial
    )


@sio.event
def gentrain_session_results_remove_request(
    gentrain_session_id, pathogen_type, fasta_id
):
    all_keys = list(
        redis_connection.hgetall(
            f"client:results:{gentrain_session_id}:{pathogen_type}:{fasta_id}"
        ).keys()
    )
    redis_connection.hdel(
        f"client:results:{gentrain_session_id}:{pathogen_type}:{fasta_id}",
        *all_keys,
    )


@sio.event
def gentrain_session_results_request(gentrain_session_id, pathogen_type):
    socket_id = request.sid
    join_room(socket_id, f"{pathogen_type}_{socket_id}")
    results = []
    for key in redis_connection.scan_iter(
        f"client:results:{gentrain_session_id}:{pathogen_type}:*"
    ):
        result = redis_connection.hgetall(key)
        all_keys = list(redis_connection.hgetall(key).keys())
        redis_connection.hdel(key, *all_keys)
        result["result"] = json.loads(result["result"])
        result["sequence_length"] = int(result["sequence_length"])
        results.append(result)
    # emit websocket messsage only in case results were found
    if len(results) > 0:
        sio.emit(
            event=f"results_{gentrain_session_id}",
            data=results,
            to=f"{pathogen_type}_{socket_id}",
        )
    leave_room(socket_id, f"{pathogen_type}_{socket_id}")


def get_genetic_errors(sequence_chunk):
    """Validate genetic data."""
    return re.findall(r"[^ATGCRYSWKMBDHVNXU\n\>]+", sequence_chunk)


def persist_sequence_chunk(sequence_chunk, chunk_information, socket_id, fasta_id):
    redis_connection.set(
        name=f"chunks:{socket_id}:{fasta_id}:{chunk_information['index']}",
        value=sequence_chunk,
    )
    redis_connection.expire(
        name=f"chunks:{socket_id}:{fasta_id}:{chunk_information['index']}",
        time=60,
    )


def get_persisted_sequence_chunk_keys(socket_id, fasta_id):
    chunk_keys = redis_connection.keys(f"chunks:{socket_id}:{fasta_id}:*")
    chunk_keys.sort()
    return chunk_keys
