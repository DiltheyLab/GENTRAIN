import json
import os
import zipfile
from Bio import Align
from flask import Response, jsonify, request, abort, send_file
from api.modules.core.models import serialize_pathogen
from prisma.models import pathogen as Pathogen
from api.app import app
from api.server import redis_connection
import io

from api.config import get_project_path

# Pathogens
@app.route("/pathogens", methods=["GET"])
def get_all_pathogens():
    pathogens = Pathogen.prisma().find_many()
    return [serialize_pathogen(pathogen) for pathogen in pathogens]


@app.route("/pathogens/<int:pathogen_id>", methods=["GET"])
def get_pathogen(pathogen_id: int):
    pathogen = Pathogen.prisma().find_unique(
        where={
            "id": pathogen_id,
        }
    )
    if not pathogen:
        abort(404)
    return serialize_pathogen(pathogen)


# Sequence Analyses
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


@app.route("/pathogens/<int:pathogen_id>/scheme", methods=["GET"])
def download_scheme(pathogen_id: str):
    pathogen = Pathogen.prisma().find_unique(
        where={
            "id": pathogen_id,
        }
    )
    if not pathogen:
        abort(404)
    scheme_path = f"{get_project_path()}/data/pathogen_schemes/{str(pathogen_id)}"
    if not os.path.isdir(scheme_path):
        abort(404)
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk(scheme_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_name = os.path.relpath(file_path, start=scheme_path)
                zip_file.write(file_path, file_name)
    buffer.seek(0)
    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"{pathogen.name.replace(' ', '-').lower()}_scheme.zip",
        mimetype="application/zip",
    )

@app.route("/pathogens/<int:pathogen_id>/example_data/<string:type>", methods=["GET"])
def download_example_data(pathogen_id: str, type: str):
    pathogen = Pathogen.prisma().find_unique(
        where={
            "id": pathogen_id,
        }
    )
    if not pathogen:
        abort(404)

    # Handle request file type based on query parameters and pathogen type
    filename = pathogen.name.lower().replace(' ', '-').replace(r'[^\w\-]', '-')

    if type == "case":
        filename += "_falldaten.csv"
    if type == "sequence" and pathogen.type ==  "viral":
        filename  += "_sequenzdaten.fasta"
    if type == "sequence" and pathogen.type ==  "bacterial":
        filename  += "_sequenzdaten.zip"
    if type == "contact":
        filename  += "_kontaktdaten.csv"
    if not filename:
        abort(422)

    file_path = f"{get_project_path()}/data/pathogen_example_data/{str(pathogen_id)}/{filename}"
    if not os.path.exists(file_path):
         abort(404)
    return send_file(file_path, as_attachment=True, download_name=filename)