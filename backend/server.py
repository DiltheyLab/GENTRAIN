from alembic.command import current
from flask_login import current_user
from flask_security import hash_password
from rq import Queue
from os import environ
from redis import Redis
from flask import jsonify, redirect, current_app, request
from flask import url_for
from flask_admin import helpers as admin_helpers
from flask_socketio import SocketIO
from sqlalchemy.sql.functions import current_timestamp
from werkzeug.local import LocalProxy
from backend import db
from backend.app import admin, app, security, user_datastore

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


from backend.admin.models import Pathogen, User, Role
from backend.admin.views import PathogenView, UserView

admin.add_view(PathogenView(Pathogen, db.session))
admin.add_view(UserView(User, db.session))


# define a context processor for merging flask-admin's template context into the
# flask-security views.

@security.context_processor
def security_context_processor():
    return dict(
        admin_base_template=admin.theme.base_template,
        admin_view=admin.index_view,
        theme=admin.theme,
        h=admin_helpers,
        get_url=url_for,
    )

@app.route("/admin/confirm_user", methods=["POST"])
def confirm_user():
    new_password = request.form['new_password']
    new_password_confirm = request.form['new_password_confirm']
    if new_password != new_password_confirm:
        return redirect(url_for("security.change_password"))
    current_user.confirmed_at = current_timestamp()
    current_user.password = hash_password(new_password)
    user_datastore.put(current_user)
    db.session.commit()
    return redirect("/admin")

@app.route("/pathogens", methods=["GET"])
def get_all_pathogens():
    return jsonify([pathogen.serialize() for pathogen in Pathogen.query.all()])


@app.route("/pathogens/<int:pathogen_id>", methods=["GET"])
def get_pathogens(pathogen_id: int):
    return jsonify(Pathogen.query.get(pathogen_id).serialize())


if __name__ == "__main__":
    app.run()
