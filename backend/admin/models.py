from backend.app import db


class Pathogen(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    genetic_distance_threshold = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String, nullable=False)
    scheme_name = db.Column(db.String, nullable=False)
    scheme_path = db.Column(db.String, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "genetic_distance_threshold": self.genetic_distance_threshold,
            "type": self.type,
            "scheme_name": self.scheme_name
        }
