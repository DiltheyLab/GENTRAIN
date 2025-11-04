from os import environ

from flask_cors import CORS
from flask import Flask
from prisma import Prisma, register

db = Prisma()
db.connect()
register(db)
app = Flask(__name__)
if environ.get("APP_ENV") == "development":
    CORS(app)
app.config.from_pyfile("config.py")
