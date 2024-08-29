import os
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from redis import Redis
from rq import Queue
import rq_dashboard
from backend.routes import api
from backend.strategies.pathogen_strategy_manager import PathogenStrategyManager

app = Flask(__name__)
queue = Queue(
    connection=Redis(
        host="redis",
        port=6379,
    )
)

app.config["SECRET_KEY"] = "secret!"
app.config["RQ_DASHBOARD_REDIS_URL"] = "redis://redis:6379"

MAX_BUFFER_SIZE = 5 * 1000 * 1000
socketio = SocketIO(
    app,
    message_queue="redis://redis:6379",
    max_http_buffer_size=MAX_BUFFER_SIZE,
    cors_allowed_origins=["http://localhost:3000", "http://localhost:4173"],
)

if os.environ.get("FLASK_ENV") == "development":
    CORS(app, origins=["http://localhost:3000", "http://localhost:4173"])

app.register_blueprint(api, url_prefix="/api")

app.config.from_object(rq_dashboard.default_settings)
rq_dashboard.web.setup_rq_connection(app)
app.register_blueprint(rq_dashboard.blueprint, url_prefix="/rq")


@socketio.event
def join(room_identifier):
    join_room(room_identifier)
    emit("room_created", room_identifier, to=room_identifier)


@socketio.event
def leave(room_identifier):
    leave_room(room_identifier)


@socketio.event
def sample_analysis(room_identifier, pathogen_name, fasta_id, sequence):
    strategy = PathogenStrategyManager.get_sample_analysis_strategy(
        pathogen_name=pathogen_name,
        fasta_id=fasta_id,
        sequence=sequence,
    )
    queue.enqueue(strategy.execute, room_identifier)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
