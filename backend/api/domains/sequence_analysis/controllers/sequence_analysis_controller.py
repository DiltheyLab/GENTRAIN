import json
from Bio import Align
from flask import jsonify, abort
from prisma.models import pathogen as Pathogen
from api.app import app
from api.server import redis_connection
from api.config import get_project_path
from api.domains.pathogen_registry.models import Pathogen as PathogenModel


@app.route(
    "/sequence_analyses/<string:fasta_hash>",
    methods=["GET"],
)
def get_sequence_analysis_result(fasta_hash: str):
    sequence_analysis = redis_connection.hgetall(
        f"client:sequence_analysis:{fasta_hash}"
    )
    if not sequence_analysis:
        abort(422)
    if "enqueued_at" not in sequence_analysis:
        redis_connection.delete(f"client:sequence_analysis:{fasta_hash}")
        abort(422)
    if "result" not in sequence_analysis:
        return jsonify(None)
    return jsonify(json.loads(sequence_analysis["result"]))


@app.route(
    "/sequence_analyses/<string:fasta_hash>",
    methods=["DELETE"],
)
def delete_sequence_analysis_result(fasta_hash: str):
    redis_connection.delete(f"client:sequence_analysis:{fasta_hash}")
    return jsonify([])
