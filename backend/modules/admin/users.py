from flask_security import SQLAlchemyUserDatastore
from backend.app import app, db
from backend.modules.core.models import User, Role

user_datastore = SQLAlchemyUserDatastore(db, User, Role)

with app.app_context():
    db.create_all()
    role_count = Role.query.count()
    user_count = User.query.count()
    super_admin_role = Role.query.filter(Role.name == "super_admin").one_or_none()
    if not super_admin_role:
        super_admin_role = Role(name="super_admin")
        db.session.add(super_admin_role)
    admin_role = Role.query.filter(Role.name == "admin").one_or_none()
    if not admin_role:
        admin_role = Role(name="admin")
        db.session.add(admin_role)
    user_role = Role.query.filter(Role.name == "user").one_or_none()
    if not user_role:
        user_role = Role(name="user")
        db.session.add(admin_role)
    if user_count == 0:
        super_admin_user = user_datastore.create_user(
            email="admin@gentrain.com", password="admin"
        )
        user_datastore.add_role_to_user(super_admin_user, super_admin_role)
        db.session.add(super_admin_user)
    db.session.commit()
