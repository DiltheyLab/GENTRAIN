import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from redis import Redis
from rq import Queue
from backend.routes import api
from backend.strategies.pathogen_strategy_manager import PathogenStrategyManager

app = Flask(__name__)
queue = Queue(
    connection=Redis(
        host="redis",
        port=6379,
    )
)

app.config["SECRET_KEY"] = os.environ.get("RQ_SECRET")

MAX_BUFFER_SIZE = 5 * 1000 * 1000


if os.environ.get("FLASK_ENV") == "development":
    CORS(app, origins=["http://localhost:3000", "http://localhost:4173"])
    socketio = SocketIO(
        app,
        message_queue="redis://redis:6379",
        max_http_buffer_size=MAX_BUFFER_SIZE,
        cors_allowed_origins=[
            "http://localhost:3000",
            "http://localhost:4173",
        ],
    )
else:
    CORS(app)
    socketio = SocketIO(
        app,
        message_queue="redis://redis:6379",
        max_http_buffer_size=MAX_BUFFER_SIZE,
    )

app.register_blueprint(api, url_prefix="/api")


@socketio.event
def join(session_id):
    join_room(session_id)
    emit("room_created", session_id, to=session_id)


@socketio.event
def leave(session_id):
    leave_room(session_id)


@socketio.event
def sample_analysis(session_id, pathogen_name, fasta_id, sequence):
    print(session_id)
    strategy = PathogenStrategyManager.get_sample_analysis_strategy(
        pathogen_name=pathogen_name,
        fasta_id=fasta_id,
        sequence=sequence,
    )
    queue.enqueue(strategy.execute, session_id)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
