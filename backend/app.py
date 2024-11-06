from flask_login import current_user
from flask_security import Security, SQLAlchemyUserDatastore
from flask_admin import Admin
from flask_cors import CORS
from flask import Flask
from flask_admin.theme import Bootstrap4Theme
import typing as t


from backend import db
from backend.admin.models import User, Role
from backend.admin.views import PanelView

app = Flask(__name__)
CORS(app)
app.config.from_pyfile("config.py")
admin = Admin(app, name="gentrain-admin", theme=Bootstrap4Theme(base_template="master.html"), index_view=PanelView(name="Panel"))
user_datastore = SQLAlchemyUserDatastore(db, User, Role)
security = Security(app, user_datastore)
db.init_app(app)
