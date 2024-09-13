import json
from rq import Queue
import socketio
import os
from redis import Redis
from backend.strategies.pathogen_strategy_manager import PathogenStrategyManager

redis_connection = Redis(host="gentrain-redis", port=6379, decode_responses=True)
queue_viral = Queue(name="viral", connection=redis_connection)
queue_bacterial = Queue(name="bacterial", connection=redis_connection)

MAX_BUFFER_SIZE = 5 * 1000 * 1000

redis_manager = socketio.RedisManager("redis://gentrain-redis:6379")

if os.environ.get("FLASK_ENV") == "development":
    sio = socketio.Server(
        async_mode="threading",
        client_manager=redis_manager,
        max_http_buffer_size=MAX_BUFFER_SIZE,
        cors_allowed_origins=["http://localhost:3000", "http://localhost:4173"],
    )
else:
    sio = socketio.Server(
        async_mode="threading",
        client_manager=redis_manager,
        max_http_buffer_size=MAX_BUFFER_SIZE,
        cors_allowed_origins=[],
    )

app = socketio.WSGIApp(sio)


@sio.event
def join_viral(socket_id, gentrain_session_id):
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
    sio.enter_room(socket_id, f"viral_{socket_id}")
    sio.emit(
        "viral_room_created",
        f"viral_{socket_id}",
        room=f"viral_{socket_id}",
    )
    print(f"viral_{socket_id} created")


@sio.event
def join_bacterial(socket_id, gentrain_session_id):
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)
    sio.enter_room(socket_id, f"bacterial_{socket_id}")
    sio.emit(
        "bacterial_room_created",
        f"bacterial_{socket_id}",
        room=f"bacterial_{socket_id}",
    )
    print(f"bacterial_{socket_id} created")


@sio.event
def leave_viral(socket_id):
    sio.leave_room(socket_id, f"viral_{socket_id}")
    print(f"viral_{socket_id} closed")


@sio.event
def leave_bacterial(socket_id):
    sio.leave_room(socket_id, f"bacterial_{socket_id}")
    print(f"bacterial_{socket_id} closed")


@sio.event
def init_gentrain_session(socket_id, gentrain_session_id):
    redis_connection.set(f"client:gentrain_session:{socket_id}", gentrain_session_id)


@sio.event
def sequence_analysis_request(socket_id, pathogen_name, fasta_id, sequence):
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
    print(all_keys)
    redis_connection.hdel(
        f"client:results:{gentrain_session_id}:{pathogen_type}:{fasta_id}", *all_keys
    )


@sio.event
def gentrain_session_results_request(_, gentrain_session_id, pathogen_type):
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
        sio.emit(f"results_{gentrain_session_id}", results)


@sio.event
def connect(socket_id, environ, auth):
    redis_connection.set(f"client:connected:{socket_id}", 1)


@sio.event
def reconnect(socket_id, environ, auth):
    redis_connection.set(f"client:connected:{socket_id}", 1)


@sio.event
def disconnect(socket_id):
    redis_connection.delete(f"client:connected:{socket_id}")


if __name__ == "__main__":
    socketio.run(app)
