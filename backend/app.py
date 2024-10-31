from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_cors import CORS
from flask import Flask
from flask_admin.theme import Bootstrap4Theme

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "secret!"
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql://admin:root@gentrain-db:5432/gentrain_db"
)

db = SQLAlchemy(app)


admin = Admin(app, name="gentrain-admin", theme=Bootstrap4Theme(swatch="litera"))
#
