__version__ = "0.0.1"

from flask_sqlalchemy import SQLAlchemy

import logging

logging.basicConfig()
logging.getLogger('sqlalchemy').setLevel(logging.ERROR)

db = SQLAlchemy()

roles_users = db.Table(
    "roles_users",
    db.Column("user_id", db.Integer(), db.ForeignKey("user.id")),
    db.Column("role_id", db.Integer(), db.ForeignKey("role.id")),
)

from backend.events import connection
from backend.events import sequence_analysis
import backend.db
