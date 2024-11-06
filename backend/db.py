from flask_security import hash_password
from backend import db
from backend.admin.models import Role, User
from backend.app import app, user_datastore

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
            first_name="Admin",
            email="admin@example.com",
            password=hash_password("admin"),
            roles=[super_user_role],
        )

    db.session.commit()