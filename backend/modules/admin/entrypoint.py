from flask_admin import Admin
from flask_admin.theme import Bootstrap4Theme

from backend import db
from backend.app import app
gifrom backend.modules.admin.views import PathogenView, UserView, PathogenIndexView
from backend.modules.core.models import User, Pathogen

# init flask admin with pathogen view as index and bind a custom master template
admin = Admin(app, name="gentrain-admin",
              theme=Bootstrap4Theme(base_template="master.html"),
              index_view=PathogenIndexView(model=Pathogen, session=db.session, url="/admin"),
              )
# bind admin views with models
admin.add_view(PathogenView(Pathogen, db.session))
admin.add_view(UserView(User, db.session))
