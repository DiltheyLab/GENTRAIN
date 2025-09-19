from os import path
from os.path import exists

from flask_security import RoleMixin, UserMixin
from werkzeug.utils import secure_filename

from backend.app import db
from backend.config import get_project_path

roles_users = db.Table(
    "roles_users",
    db.Column("user_id", db.Integer(), db.ForeignKey("user.id")),
    db.Column("role_id", db.Integer(), db.ForeignKey("role.id")),
)


class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    def __str__(self):
        return self.name


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    confirmed_at = db.Column(db.DateTime())
    roles = db.relationship(
        "Role", secondary=roles_users, backref=db.backref("users", lazy="dynamic")
    )
    fs_uniquifier = db.Column(db.String(64), unique=True, nullable=False)


class Pathogen(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    genetic_distance_threshold = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String, nullable=False)
    activated = db.Column(db.Boolean, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "genetic_distance_threshold": self.genetic_distance_threshold,
            "type": self.type,
        }

    def get_example_data_path(self, file_type):
        example_data_mappings = {
            "cases": {"extension": "csv", "filename": "falldaten"},
            "sequences": {
                "extension": "fasta" if self.type == "viral" else "zip",
                "filename": "sequenzdaten",
            },
            "contacts": {"extension": "csv", "filename": "kontaktdaten"},
        }
        file_path = f"static/pathogen_example_data/{secure_filename(self.name)}/{example_data_mappings[file_type]['filename']}.{example_data_mappings[file_type]['extension']}"
        return file_path if exists(f"{get_project_path()}/{file_path}") else None
