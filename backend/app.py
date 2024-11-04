from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_cors import CORS
from flask import Flask
from os import environ
from flask_admin.theme import Bootstrap4Theme

app = Flask(__name__)
CORS(app)

app.config.from_pyfile("config.py")

db = SQLAlchemy(app)


admin = Admin(app, name="gentrain-admin", theme=Bootstrap4Theme(swatch="litera"))
