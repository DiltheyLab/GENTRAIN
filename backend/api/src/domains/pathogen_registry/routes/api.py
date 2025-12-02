from flask import jsonify, Response

from src.app import app
from src.domains.pathogen_registry.controllers.pathogen_controller import get_all_pathogens_action, get_pathogen_action, \
    download_scheme_action, download_example_data_action

@app.route("/pathogens", methods=["GET"])
def get_all_pathogens():
    return get_all_pathogens_action()

@app.route("/pathogens/<int:pathogen_id>", methods=["GET"])
def get_pathogen(pathogen_id: int):
    return get_pathogen_action(pathogen_id)

@app.route("/pathogens/<int:pathogen_id>/scheme", methods=["GET"])
def download_scheme(pathogen_id: int):
    return download_scheme_action(pathogen_id)

@app.route("/pathogens/<int:pathogen_id>/example_data/<string:type>", methods=["GET"])
def download_example_data(pathogen_id: int, type: str):
    return download_example_data_action(pathogen_id, type)