from flask_login import login_required, current_user
from flask_security import Form
from flask_security.forms import get_form_field_label, Length, password_required, EqualTo
from flask_security.utils import get_message
from rq import Queue
from os import environ
from redis import Redis
from flask import jsonify, render_template, redirect, request
from flask import url_for
from flask_admin import helpers as admin_helpers
from flask_socketio import SocketIO
from wtforms.fields.simple import PasswordField, SubmitField

from backend import db
from backend.app import admin, app, security

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

class ConfirmUserForm(Form):
    """The default change password form"""

    new_password = PasswordField(
        get_form_field_label('new_password'),
        validators=[password_required, Length(min=6, max=128, message='PASSWORD_INVALID_LENGTH')])

    new_password_confirm = PasswordField(
        get_form_field_label('retype_password'),
        validators=[EqualTo('new_password',
                            message='RETYPE_PASSWORD_MISMATCH'),
                    password_required])

    submit = SubmitField(get_form_field_label('change_password'))

    def validate(self):
        if current_user.password == self.new_password.data:
            self.new_password.errors.append(get_message('PASSWORD_IS_THE_SAME')[0])
            return False
        return True

@app.route("/admin/confirm_user", methods=["GET"])
def confirm_user():
    form = ConfirmUserForm()
    return render_template(
        'security/change_password.html',
        confirm_user_form=form,
    )

@app.route("/pathogens", methods=["GET"])
def get_all_pathogens():
    return jsonify([pathogen.serialize() for pathogen in Pathogen.query.all()])


@app.route("/pathogens/<int:pathogen_id>", methods=["GET"])
def get_pathogens(pathogen_id: int):
    return jsonify(Pathogen.query.get(pathogen_id).serialize())


if __name__ == "__main__":
    app.run()
