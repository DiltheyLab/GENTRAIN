import json
from backend.server import sio, redis_connection, queue_viral, queue_bacterial
from backend.strategies.pathogen_strategy_manager import PathogenStrategyManager


@sio.event
def sequence_analysis_request(
    socket_id, pathogen_name, fasta_id, sequence_chunk, chunk_information
):
    redis_connection.set(
        name=f"chunks:{socket_id}:{fasta_id}:{chunk_information['index']}",
        value=sequence_chunk,
    )
    redis_connection.expire(
        name=f"chunks:{socket_id}:{fasta_id}:{chunk_information['index']}",
        time=300,
    )
    chunk_keys = redis_connection.keys(f"chunks:{socket_id}:{fasta_id}:*")
    chunk_keys.sort()
    if chunk_information["total"] > len(chunk_keys):
        return
    sequence = ""
    for key in chunk_keys:
        sequence += redis_connection.get(key)
        redis_connection.delete(key)
    strategy = PathogenStrategyManager.get_sequence_analysis_strategy(
        pathogen_name=pathogen_name,
        fasta_id=fasta_id,
        sequence=sequence,
        socket_id=socket_id,
    )
    strategy.enqueue_analysis(
        queue_viral if strategy.type == "viral" else queue_bacterial
    )


@sio.event
def gentrain_session_results_remove_request(
    _, gentrain_session_id, pathogen_type, fasta_id
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
def gentrain_session_results_request(socket_id, gentrain_session_id, pathogen_type):
    sio.enter_room(socket_id, f"{pathogen_type}_{socket_id}")
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
            room=f"{pathogen_type}_{socket_id}",
        )
    sio.leave_room(socket_id, f"{pathogen_type}_{socket_id}")
