from flask_cors import CORS
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)
app.config.from_pyfile("config.py")
db = SQLAlchemy(app)