from flask import jsonify

from src.app import app


@app.errorhandler(404)
def not_found(error):
    response = {
        "error": "Not Found",
        "message": "The requested resource could not be found.",
    }
    return jsonify(response), 404


@app.errorhandler(422)
def unprocessable_entity(error):
    response = {
        "error": "Unprocessable Entity",
        "message": "The requested resource could not be processed.",
    }
    return jsonify(response), 422


@app.errorhandler(500)
def unprocessable_entity(error):
    response = {
        "error": "Internal Server Error",
    }
    return jsonify(response), 500
