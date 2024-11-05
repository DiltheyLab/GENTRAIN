from flask_security import RoleMixin, UserMixin

from backend import db, roles_users


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __str__(self):
        return self.name


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255))
    last_name = db.Column(db.String(255))
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship(
        "Role", secondary=roles_users, backref=db.backref("users", lazy="dynamic")
    )
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)

    def __str__(self):
        return self.email

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
