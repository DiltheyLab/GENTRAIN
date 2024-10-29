from backend.server import db


class Pathogen(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    genetic_distance_threshold = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String, nullable=False)
    scheme_name = db.Column(db.String, nullable=False)
    scheme_path = db.Column(db.String, nullable=False)
