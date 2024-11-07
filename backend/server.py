from rq import Queue
from os import environ
from redis import Redis
from flask_socketio import SocketIO

from backend.app import app

redis_connection = Redis(host="gentrain-redis", port=6379, decode_responses=True)
queue_viral = Queue(name="viral", connection=redis_connection)
queue_bacterial = Queue(name="bacterial", connection=redis_connection)

if environ.get("FLASK_ENV") == "development":
    sio = SocketIO(
        app,
        async_mode="threading",
        message_queue="redis://gentrain-redis:6379",
        cors_allowed_origins=["http://localhost:3000", "http://localhost:4173"],
    )
else:
    sio = SocketIO(
        app,
        async_mode="threading",
        message_queue="redis://gentrain-redis:6379",
        cors_allowed_origins=[],
    )


if __name__ == "__main__":
    app.run()
