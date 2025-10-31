from Bio import Align
from flask import Response, jsonify, request
from prisma.models import pathogen as Pathogen
from api.app import app
from api.server import redis_connection

from api.config import get_project_path
from api.domains.pathogen_registry.models import Pathogen as PathogenModel

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