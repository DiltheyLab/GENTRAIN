from prisma.models import pathogen as Pathogen
from flask import request
from src.app import app
from src.domains.sequence_analysis.controllers.sequence_analysis_controller import get_sequence_analysis_result_action, \
    delete_sequence_analysis_result_action
from src.domains.sequence_analysis.controllers.sequence_controller import align_sequences_action


### Sequence Analyses ###

@app.route(
    "/sequence_analyses/<string:fasta_hash>/result",
    methods=["GET"],
)
def get_sequence_analysis_result(fasta_hash: str):
    return get_sequence_analysis_result_action(fasta_hash)

@app.route(
    "/sequence_analyses/<string:fasta_hash>/result",
    methods=["DELETE"],
)
def delete_sequence_analysis_result(fasta_hash: str):
    return delete_sequence_analysis_result_action(fasta_hash)

### Sequences ###

@app.route("/sequences/align", methods=["POST"])
def align_sequences():
    return align_sequences_action(request.get_json())