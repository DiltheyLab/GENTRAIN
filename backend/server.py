from rq import Queue
import os
from redis import Redis
from flask import Flask
from flask_socketio import SocketIO


redis_connection = Redis(host="gentrain-redis", port=6379, decode_responses=True)
queue_viral = Queue(name="viral", connection=redis_connection)
queue_bacterial = Queue(name="bacterial", connection=redis_connection)

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"

if os.environ.get("FLASK_ENV") == "development":
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


# import socket events underneath the socket initilization to prevent circular import issues
from backend.events import connection
from backend.events import sequence_analysis


if __name__ == "__main__":
    sio.run(app)
