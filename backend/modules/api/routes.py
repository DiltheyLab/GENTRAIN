import json
from Bio import Align
from flask import Response, jsonify, request
from backend.modules.core.models import Pathogen
from backend.app import app
from backend.server import redis_connection


# Pathogens
@app.route("/pathogens", methods=["GET"])
def get_all_pathogens():
    return jsonify([pathogen.serialize() for pathogen in Pathogen.query.all()])


@app.route("/pathogens/<int:pathogen_id>", methods=["GET"])
def get_pathogens(pathogen_id: int):
    return jsonify(Pathogen.query.get(pathogen_id).serialize())


# Sequence Analyses
@app.route(
    "/sequence_analyses/sessions/<string:session_id>/pathogens/<int:pathogen_id>",
    methods=["GET"],
)
def get_results_for_session_and_pathogen(session_id: str, pathogen_id: int):
    results = []
    for key in redis_connection.scan_iter(
            f"client:results:{session_id}:{pathogen_id}:*"
    ):
        result = redis_connection.hgetall(key)
        all_keys = list(result.keys())
        redis_connection.hdel(key, *all_keys)
        result["result"] = json.loads(result["result"])
        if "sequence_length" in result["result"]:
            result["sequence_length"] = int(result["result"]["sequence_length"])
        results.append(result)
    return jsonify(results)


@app.route(
    "/sequence_analyses/sessions/<string:session_id>/pathogens/<int:pathogen_id>/sequences/<string:sequence_identifier>",
    methods=["DELETE"],
)
def delete_sequence_result_for_session_and_pathogen(
        session_id: str, pathogen_id: int, sequence_identifier: str
):
    all_keys = list(
        redis_connection.hgetall(
            f"client:results:{session_id}:{pathogen_id}:{sequence_identifier}"
        ).keys()
    )
    for key in all_keys:
        redis_connection.delete(f"client:results:{session_id}:{pathogen_id}:{sequence_identifier}:{key}")
    return jsonify([])


@app.route("/sequences/align", methods=["POST"])
def align_sequences():
    data = request.get_json()

    if "sequence_1" not in data or "sequence_2" not in data:
        return Response("Invalid request body.", status=422, mimetype="application/json")
    sequence_1 = data["sequence_1"]
    sequence_2 = data["sequence_2"]

    aligner = Align.PairwiseAligner(match_score=1.0)
    alignments = aligner.align(sequence_1, sequence_2)

    return jsonify(
        {"aligned_sequence_1": alignments[0][0], "aligned_sequence_2": alignments[1][1]}
    )
