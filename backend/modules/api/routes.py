import json
from Bio import Align
from flask import Response, jsonify, request, abort
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
    "/sequence_analyses/<string:fasta_hash>",
    methods=["GET"],
)
def get_sequence_analysis_result(fasta_hash: str):
    result = redis_connection.hgetall(f"client:results:{fasta_hash}")
    if not result:
        abort(404)
    return jsonify(json.loads(result["result"]))


@app.route(
    "/sequence_analyses/<string:fasta_hash>",
    methods=["DELETE"],
)
def delete_sequence_analysis_result(fasta_hash: str):
    redis_connection.delete(f"client:results:{fasta_hash}")
    return jsonify([])


@app.route("/sequences/align", methods=["POST"])
def align_sequences():
    data = request.get_json()

    if "sequence_1" not in data or "sequence_2" not in data:
        return Response(
            "Invalid request body.", status=422, mimetype="application/json"
        )
    sequence_1 = data["sequence_1"]
    sequence_2 = data["sequence_2"]

    aligner = Align.PairwiseAligner(match_score=1.0)
    alignments = aligner.align(sequence_1, sequence_2)

    return jsonify(
        {"aligned_sequence_1": alignments[0][0], "aligned_sequence_2": alignments[1][1]}
    )
