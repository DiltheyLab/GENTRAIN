from os import path, listdir, remove, rename

from flask import request, url_for, redirect, abort
from flask_admin import expose, AdminIndexView
from flask_admin.contrib import sqla
from flask_admin.form.upload import FileUploadField
from flask_login import current_user
from flask_security import hash_password, SQLAlchemyUserDatastore

from zipfile import ZipFile
import time
import shutil

from backend import db
from backend.modules.core.models import User, Role
from backend.config import get_project_path


class AuthModelView(sqla.ModelView):
    def is_accessible(self):
        return (
                current_user.is_active
                and current_user.is_authenticated
        )

    def _handle_view(self, name, **kwargs):
        """
        Override builtin _handle_view in order to redirect users when a view is not
        accessible.
        """
        if not self.is_accessible():
            if current_user.is_authenticated:
                # permission denied
                abort(403)
            else:
                # login
                return redirect(url_for("security.login", next=request.url))


class UserView(AuthModelView):
    def is_accessible(self):
        return (
                super().is_accessible()
                and current_user.has_role("superuser")
        )

    column_list = ["id", "email", "first_name", "last_name"]
    form_columns = ["roles", "email", "first_name", "last_name", "password"]
    edit_template = 'admin/edit.html'
    create_template = 'admin/create.html'
    def create_model(self, form):
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        user_datastore.create_user(
            first_name=form.first_name.data,
            last_name=form.last_name.data,
            email=form.email.data,
            password=hash_password(form.password.data),
            roles=form.roles.data,
        )
        db.session.commit()

class PathogenView(AuthModelView):
    def is_accessible(self):
        return (
                super().is_accessible()
                and (current_user.has_role("user") or current_user.has_role("superuser"))
        )

    edit_template = 'admin/edit.html'
    create_template = 'admin/create.html'
    prior_scheme_name = None
    form_choices = {
        "type": [
            ("bacterial", "Bacterial"),
            ("viral", "Viral"),
        ]
    }
    form_overrides = {"scheme_path": FileUploadField}
    form_args = {
        "scheme_path": {
            "label": "File",
            "base_path": path.join(get_project_path(), "modules/sequence_analysis/schemes"),
            "allow_overwrite": True,
            "allowed_extensions": ["zip"]
        }
    }

    def update_model(self, form, model):
        self.prior_scheme_name = model.scheme_name
        return super().update_model(form, model)

    def after_model_change(self, form, model, is_created):
        if self.scheme_added(model.scheme_path):
            with ZipFile(
                    path.join(get_project_path(), f"modules/sequence_analysis/schemes/{model.scheme_path}"), "r"
            ) as archive:
                directory_name = f"{model.scheme_name}_{round(time.time() * 1000)}"
                extract_path = path.join(
                    get_project_path(),
                    f"modules/sequence_analysis/schemes/{directory_name}",
                )
                archive.extractall(path=extract_path)
                content = listdir(
                    path.join(
                        get_project_path(),
                        f"modules/sequence_analysis/schemes/{directory_name}",
                    )
                )
                if len(content) == 1:
                    sub_path = path.join(
                        get_project_path(),
                        f"modules/sequence_analysis/schemes/{directory_name}/{content[0]}",
                    )
                    elements = listdir(sub_path)
                    for element in elements:
                        shutil.move(path.join(sub_path, element), extract_path)
                    shutil.rmtree(sub_path)
                if self.scheme_exists(self.prior_scheme_name):
                    shutil.rmtree(path.join(get_project_path(), f"schemes/{self.prior_scheme_name}"))
                shutil.move(
                    path.join(
                        get_project_path(),
                        f"modules/sequence_analysis/schemes/{directory_name}",
                    ),
                    path.join(
                        get_project_path(),
                        f"modules/sequence_analysis/schemes/{model.scheme_name}",
                    ),
                )
            remove(path.join(get_project_path(), f"modules/sequence_analysis/schemes/{model.scheme_path}"))
        if is_created is False and model.scheme_name and model.scheme_name != self.prior_scheme_name:
            rename(path.join(get_project_path(), f"modules/sequence_analysis/schemes/{self.prior_scheme_name}"),
                   path.join(get_project_path(), f"modules/sequence_analysis/schemes/{model.scheme_name}"))

    def after_model_delete(self, model):
        if path.isdir(path.join(get_project_path(), f"modules/sequence_analysis/schemes/{model.scheme_name}")):
            shutil.rmtree(path.join(get_project_path(), f"modules/sequence_analysis/schemes/{model.scheme_name}"))

    def scheme_exists(self, scheme_name):
        return scheme_name and path.isdir(path.join(get_project_path(), f"modules/sequence_analysis/schemes/{scheme_name}"))

    def scheme_added(self, scheme_path):
        return path.isfile(path.join(get_project_path(), f"modules/sequence_analysis/schemes/{scheme_path}"))

class PathogenIndexView(PathogenView):
    def __init__(self, model, session, *args, **kwargs):
        super(PathogenIndexView, self).__init__(model, session, *args, **kwargs)
        self.static_folder = 'static'
        self.endpoint = 'pathogen-index'
        self.name = 'PathogenIndex'

    def is_visible(self):
        return False

    def is_accessible(self):
        return (
                current_user.is_active
                and current_user.is_authenticated
        )
