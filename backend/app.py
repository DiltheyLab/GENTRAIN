from flask_cors import CORS
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_basicauth import BasicAuth

app = Flask(__name__)
CORS(app)
app.config.from_pyfile("config.py")
basic_auth = BasicAuth(app)
db = SQLAlchemy(app)
