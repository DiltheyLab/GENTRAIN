from flask import Blueprint
from controllers.pathogen_controller import pathogens

# main blueprint to be registered with application
api = Blueprint("api", __name__)

# register user with api blueprint
api.register_blueprint(pathogens, url_prefix="/pathogens")
