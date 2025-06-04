from flask import url_for
from flask_security import Security
from flask_admin import helpers as admin_helpers
from backend.app import app
from backend.modules.admin.entrypoint import admin
from backend.modules.admin.users import user_datastore

security = Security(app, user_datastore)

# define a context processor for merging flask-admin's template context into the
# flask-security views.
@security.context_processor
def security_context_processor():
    return dict(
        admin_base_template=admin.theme.base_template,
        admin_view=admin.index_view,
        theme=admin.theme,
        h=admin_helpers,
        get_url=url_for,
    )
