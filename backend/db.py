from flask_security import hash_password
from backend import db
from backend.admin.models import Role
from backend.app import app, user_datastore

with app.app_context():
    db.drop_all()
    db.create_all()
    user_role = Role(name="user")
    db.session.add(user_role)
    super_user_role = Role(name="superuser")
    db.session.add(super_user_role)
    user_datastore.create_user(
        first_name="Admin",
        email="admin@example.com",
        password=hash_password("admin"),
        roles=[super_user_role],
    )
    db.session.commit()
    db.init_app(app)