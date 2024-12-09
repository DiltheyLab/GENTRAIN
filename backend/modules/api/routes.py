import json

from flask import jsonify
from backend.modules.core.models import Pathogen
from backend.app import app
from backend.server import sio, redis_connection

# Pathogens
@app.route("/pathogens", methods=["GET"])
def get_all_pathogens():
    return jsonify([pathogen.serialize() for pathogen in Pathogen.query.all()])
@app.route("/pathogens/<int:pathogen_id>", methods=["GET"])
def get_pathogens(pathogen_id: int):
    return jsonify(Pathogen.query.get(pathogen_id).serialize())

# Sequence Analyses
@app.route("/sequence_analyses/sessions/<string:session_id>/pathogens/<int:pathogen_id>", methods=["GET"])
def get_results_for_session_and_pathogen(session_id: str, pathogen_id: int):
    results = []
    for key in redis_connection.scan_iter(
            f"client:results:{session_id}:{pathogen_id}:*"
    ):
        result = redis_connection.hgetall(key)
        all_keys = list(result.keys())
        redis_connection.hdel(key, *all_keys)
        result["result"] = json.loads(result["result"])
        result["sequence_length"] = int(result["sequence_length"])
        results.append(result)
    return jsonify(results)

@app.route("/sequence_analyses/sessions/<string:session_id>/pathogens/<int:pathogen_id>/sequences/<string:sequence_identifier>", methods=["DELETE"])
def delete_sequence_result_for_session_and_pathogen(session_id: str, pathogen_id: int, sequence_identifier:str):
    all_keys = list(
        redis_connection.hgetall(
            f"client:results:{session_id}:{pathogen_id}:{sequence_identifier}"
        ).keys()
    )
    redis_connection.hdel(
        f"client:results:{session_id}:{pathogen_id}:{sequence_identifier}",
        *all_keys,
    )
    return jsonify([])
