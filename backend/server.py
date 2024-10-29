from rq import Queue
from os import path, environ
from redis import Redis
from flask import Flask
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin


def get_project_root():
    return path.dirname(__file__)


redis_connection = Redis(host="gentrain-redis", port=6379, decode_responses=True)
queue_viral = Queue(name="viral", connection=redis_connection)
queue_bacterial = Queue(name="bacterial", connection=redis_connection)

app = Flask(__name__)
app.config["SECRET_KEY"] = "secret!"
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://admin:root@gentrain-db:5432/gentrain_db"
)


db = SQLAlchemy(app)

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

from backend.admin.models import Pathogen
from backend.admin.views import PathogenView

admin = Admin(app, name="gentrain-admin", template_mode="bootstrap4")
admin.add_view(PathogenView(Pathogen, db.session))

with app.app_context():
    db.drop_all()
    db.create_all()

# import socket events underneath the socket initilization to prevent circular import issues
from backend.events import connection
from backend.events import sequence_analysis

if __name__ == "__main__":

    app.run()
