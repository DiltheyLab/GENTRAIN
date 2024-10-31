from rq import Queue
from os import environ
from redis import Redis
from flask import jsonify
from flask_socketio import SocketIO
from backend.app import admin, db, app


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


# import socket events underneath the socket initilization to prevent circular import issues
from backend.events import connection
from backend.events import sequence_analysis
from backend.admin.models import Pathogen
from backend.admin.views import PathogenView

admin.add_view(PathogenView(Pathogen, db.session))


@app.route("/pathogens", methods=["GET"])
def get_all_pathogens():
    return jsonify([pathogen.serialize() for pathogen in Pathogen.query.all()])


@app.route("/pathogens/<int:pathogen_id>", methods=["GET"])
def get_pathogens(pathogen_id: int):
    return jsonify(Pathogen.query.get(pathogen_id).serialize())


with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run()
