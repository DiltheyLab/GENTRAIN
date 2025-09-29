from rq import Queue
from os import environ
from redis import Redis
from flask_socketio import SocketIO

from api.app import app

redis_connection = Redis(host=environ.get("REDIS_HOST"), port=environ.get("REDIS_PORT"),
                         ssl=True, ssl_cert_reqs=None,
                         username=environ.get('REDIS_USERNAME'),
                         password=environ.get('REDIS_PASSWORD'), decode_responses=True, health_check_interval=30)
queue_viral = Queue(name="viral", connection=redis_connection)
queue_bacterial = Queue(name="bacterial", connection=redis_connection)

if environ.get("APP_ENV") == "development":
    sio = SocketIO(
        app,
        async_mode="threading",
        message_queue=f"rediss://{environ.get('REDIS_USERNAME')}:{environ.get('REDIS_PASSWORD')}@{environ.get('REDIS_HOST')}:{environ.get('REDIS_PORT')}?ssl_cert_reqs=none",
        cors_allowed_origins=[f"http://localhost:{environ.get('REACT_DEV_PORT')}",
                              f"http://localhost:{environ.get('REACT_BUILD_PORT')}"],
    )
else:
    sio = SocketIO(
        app,
        async_mode="threading",
        message_queue=f"rediss://{environ.get('REDIS_USERNAME')}:{environ.get('REDIS_PASSWORD')}@{environ.get('REDIS_HOST')}:{environ.get('REDIS_PORT')}?ssl_cert_reqs=none",
        cors_allowed_origins=[],
    )

if __name__ == "__main__":
    app.run()
