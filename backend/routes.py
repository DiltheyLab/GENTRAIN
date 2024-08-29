from flask import Blueprint
from backend.controllers.pathogen_controller import pathogens

api = Blueprint("api", __name__)
api.register_blueprint(pathogens, url_prefix="/pathogens")
