from os import environ

from flask_security import SQLAlchemyUserDatastore
from backend.app import app, db
from backend.modules.core.models import User, Role

user_datastore = SQLAlchemyUserDatastore(db, User, Role)

with app.app_context():
    db.create_all()
    role_count = Role.query.count()
    if role_count == 0:
        user_role = Role(name="user")
        db.session.add(user_role)
        super_user_role = Role(name="superuser")
        db.session.add(super_user_role)
    user_count = User.query.count()
    if user_count == 0:
        user_datastore.create_user(
            email=environ.get("ADMIN_EMAIL"),
            password=environ.get("ADMIN_PASSWORD"),
            roles=[super_user_role],
        )
    db.session.commit()
