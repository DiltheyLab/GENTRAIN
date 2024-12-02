from flask import jsonify, request
from backend.modules.core.models import Pathogen
from backend.app import app
from backend.modules.sequence_analysis.services.viral_distance_calulation import ViralDistanceCalculation


@app.route("/pathogens", methods=["GET"])
def get_all_pathogens():
    return jsonify([pathogen.serialize() for pathogen in Pathogen.query.all()])


@app.route("/pathogens/<int:pathogen_id>", methods=["GET"])
def get_pathogens(pathogen_id: int):
    return jsonify(Pathogen.query.get(pathogen_id).serialize())

@app.route("/distances", methods=["POST"])
def get_distance():
    data = request.get_json()
    mutation_1 = data["mutations_1"]
    mutation_2 = data["mutations_2"]
    viral_distance_calculation = ViralDistanceCalculation(mutation_1, mutation_2)
    distance = viral_distance_calculation.execute()
    return jsonify(distance)
