from flask_security import Security, hash_password, SQLAlchemyUserDatastore
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin, AdminIndexView, expose
from flask_cors import CORS
from flask import Flask, url_for
from flask_admin.theme import Bootstrap4Theme

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
