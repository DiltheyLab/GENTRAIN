from rq import Queue
import socketio
import os
from redis import Redis

redis_connection = Redis(host="gentrain-redis", port=6379, decode_responses=True)
queue_viral = Queue(name="viral", connection=redis_connection)
queue_bacterial = Queue(name="bacterial", connection=redis_connection)

# enlarge the bufffer size for socket messages since bacterial sequences are larger than the default length
# TODO: chunk messages
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

# import socket events underneath the socket initilization to prevent circular import issues
from backend.events import connection
from backend.events import sequence_analysis


if __name__ == "__main__":
    socketio.run(app)
