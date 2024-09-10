from rq import Queue
import socketio
import os
from redis import Redis
from backend.strategies.pathogen_strategy_manager import PathogenStrategyManager

redis_connection = Redis(host="gentrain-redis", port=6379)
queue_viral = Queue(name="viral", connection=redis_connection)
queue_bacterial = Queue(name="bacterial", connection=redis_connection)

# TODO: examine chunking
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
def join_viral(sid, gentrain_session_id):
    sio.enter_room(sid, f"viral_{gentrain_session_id}")
    sio.emit(
        "viral_room_created",
        f"viral_{gentrain_session_id}",
        room=f"viral_{gentrain_session_id}",
    )
    print(f"viral_{gentrain_session_id} created")


@sio.event
def join_bacterial(sid, gentrain_session_id):
    sio.enter_room(sid, f"bacterial_{gentrain_session_id}")
    sio.emit(
        "bacterial_room_created",
        f"bacterial_{gentrain_session_id}",
        room=f"bacterial_{gentrain_session_id}",
    )


@sio.event
def leave_viral(sid, gentrain_session_id):
    sio.leave_room(sid, f"viral_{gentrain_session_id}")
    print(f"viral_{gentrain_session_id} closed")


@sio.event
def leave_bacterial(sid, gentrain_session_id):
    sio.leave_room(sid, f"bacterial_{gentrain_session_id}")
    print(f"bacterial_{gentrain_session_id} closed")


@sio.event
def sequence_analysis_request(_, room_name, pathogen_name, fasta_id, sequence):
    strategy = PathogenStrategyManager.get_sequence_analysis_strategy(
        pathogen_name=pathogen_name,
        fasta_id=fasta_id,
        sequence=sequence,
    )
    strategy.enqueue_job(
        room_name=room_name,
        queue=queue_viral if strategy.queue == "viral" else queue_bacterial,
    )


if __name__ == "__main__":
    socketio.run(app)
