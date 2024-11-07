from flask_cors import CORS
from flask import Flask
from backend import db

app = Flask(__name__)
CORS(app)
app.config.from_pyfile("config.py")
db.init_app(app)
