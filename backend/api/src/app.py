from os import environ

from flask_cors import CORS
from flask import Flask, jsonify
from prisma import Prisma, register

db = Prisma()
db.connect()
register(db)
app = Flask(__name__)

@app.errorhandler(404)
def not_found(error):
    response = {
        "error": "Not Found",
        "message": "The requested resource could not be found."
    }
    return jsonify(response), 404

@app.errorhandler(422)
def unprocessable_entity(error):
    response = {
        "error": "Unprocessable Entity",
        "message": "The requested resource could not be processed."
    }
    return jsonify(response), 422

@app.errorhandler(500)
def unprocessable_entity(error):
    response = {
        "error": "Internal Server Error",
    }
    return jsonify(response), 500


if environ.get("APP_ENV") == "development":
    CORS(app)
app.config.from_pyfile("config.py")
