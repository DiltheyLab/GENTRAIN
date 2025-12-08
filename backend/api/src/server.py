from rq import Queue
from os import environ
from redis import Redis
from flask_socketio import SocketIO
from src.app import app

# Init redis connection with authentication to enable workers to push jobs to the queue
redis_connection = Redis(
    host=environ.get("REDIS_HOST") or "localhost",
    port=int(environ.get("REDIS_PORT") or 6379),
    username=environ.get("REDIS_USERNAME"),
    password=environ.get("REDIS_PASSWORD"),
    decode_responses=True,
    health_check_interval=30,
)


# Init redis queues for viral and bacterial sequences analysis jobs
queue_viral = Queue(name="viral", connection=redis_connection)
queue_bacterial = Queue(name="bacterial", connection=redis_connection)

if environ.get("APP_ENV") == "development":
    sio = SocketIO(
        app,
        async_mode="threading",
        message_queue=f"redis://{environ.get('REDIS_USERNAME')}:{environ.get('REDIS_PASSWORD')}@{environ.get('REDIS_HOST')}:{environ.get('REDIS_PORT')}",
        cors_allowed_origins=[
            f"http://localhost:{environ.get('REACT_DEV_PORT')}",
            f"http://localhost:{environ.get('REACT_BUILD_PORT')}",
        ],
    )
else:
    sio = SocketIO(
        app,
        async_mode="threading",
        message_queue=f"redis://{environ.get('REDIS_USERNAME')}:{environ.get('REDIS_PASSWORD')}@{environ.get('REDIS_HOST')}:{environ.get('REDIS_PORT')}",
        cors_allowed_origins=[],
    )
