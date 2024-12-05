import json
import re
from flask import request
from flask_socketio import leave_room, join_room

from backend.modules.core.models import Pathogen
from backend.server import sio, redis_connection, queue_viral, queue_bacterial
from backend.modules.sequence_analysis.strategies.pathogen_strategy_manager import (
    PathogenStrategyManager,
)


@sio.event
def init_gentrain_session(gentrain_session_id):
    socket_id = request.sid
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)


@sio.event
def join_viral(gentrain_session_id):
    socket_id = request.sid
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
    join_room(f"viral_{socket_id}")
    sio.emit(
        "viral_room_created",
        f"viral_{socket_id}",
        to=f"viral_{socket_id}",
    )
    print(f"viral_{socket_id} created")


@sio.event
def join_bacterial(gentrain_session_id):
    socket_id = request.sid
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
    join_room(f"bacterial_{socket_id}")
    sio.emit(
        "bacterial_room_created",
        f"bacterial_{socket_id}",
        to=f"bacterial_{socket_id}",
    )
    print(f"bacterial_{socket_id} created")


@sio.event
def leave_viral():
    socket_id = request.sid
    leave_room(f"viral_{socket_id}")
    print(f"viral_{socket_id} closed")


@sio.event
def leave_bacterial():
    socket_id = request.sid
    leave_room(f"bacterial_{socket_id}")
    print(f"bacterial_{socket_id} closed")


@sio.event
def sequence_analysis_request(
    pathogen_id, sequence_identifier, sequence_chunk, chunk_information
):
    pathogen = Pathogen.query.get(pathogen_id)
    socket_id = request.sid
    # validate sequence before persisting
    sequence_chunk = sequence_chunk.replace("\r", "")
    sequence_chunk = re.sub(r"\>(.*?)\n", ">\n", sequence_chunk)
    genetic_errors = get_genetic_errors(sequence_chunk)
    if len(genetic_errors) > 0:
        sio.emit(
            "sequence_analysis_response",
            {
                "status": "error",
                "sequence_identifier": sequence_identifier,
            },
            to=f"{pathogen.type}_{socket_id}",
        )
        return
    persist_sequence_chunk(
        sequence_chunk, chunk_information, socket_id, sequence_identifier
    )
    chunk_keys = get_persisted_sequence_chunk_keys(socket_id, sequence_identifier)
    if chunk_information["total"] > len(chunk_keys):
        return
    sequence = ""
    for key in chunk_keys:
        sequence += redis_connection.get(key)
        redis_connection.delete(key)
    strategy = PathogenStrategyManager.get_sequence_analysis_strategy(
        pathogen=pathogen,
        sequence_identifier=sequence_identifier,
        sequence=sequence,
        socket_id=socket_id,
    )
    strategy.enqueue_analysis(
        queue_viral if strategy.type == "viral" else queue_bacterial
    )


@sio.event
def gentrain_session_results_remove_request(
    gentrain_session_id, pathogen_type, sequence_identifier
):
    all_keys = list(
        redis_connection.hgetall(
            f"client:results:{gentrain_session_id}:{pathogen_type}:{sequence_identifier}"
        ).keys()
    )
    redis_connection.hdel(
        f"client:results:{gentrain_session_id}:{pathogen_type}:{sequence_identifier}",
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


def persist_sequence_chunk(
    sequence_chunk, chunk_information, socket_id, sequence_identifier
):
    redis_connection.set(
        name=f"chunks:{socket_id}:{sequence_identifier}:{chunk_information['index']}",
        value=sequence_chunk,
    )
    redis_connection.expire(
        name=f"chunks:{socket_id}:{sequence_identifier}:{chunk_information['index']}",
        time=60,
    )


def get_persisted_sequence_chunk_keys(socket_id, sequence_identifier):
    chunk_keys = redis_connection.keys(f"chunks:{socket_id}:{sequence_identifier}:*")
    chunk_keys.sort()
    return chunk_keys
