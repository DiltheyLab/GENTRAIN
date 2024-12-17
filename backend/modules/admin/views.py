import json
from os import path, listdir, remove, rename, environ, makedirs

from flask import request, url_for, redirect, abort
from flask_admin.contrib import sqla
from flask_admin.form.upload import FileUploadField
from flask_login import current_user
from flask_security import hash_password, SQLAlchemyUserDatastore

from zipfile import ZipFile
import time
import shutil

from backend.app import db, basic_auth
from backend.modules.admin.validators.example_data import example_data_validator
from backend.modules.admin.validators.scheme import scheme_validator
from backend.modules.core.exceptions import AuthException
from backend.modules.core.models import User, Role
from backend.config import get_project_path


class AuthModelView(sqla.ModelView):
    def is_accessible(self):
        if environ.get('APP_ENV') != "development" and not basic_auth.authenticate():
            raise AuthException('Not authenticated.')

        return (
                current_user.is_active
                and current_user.is_authenticated
        )

    def inaccessible_callback(self, name, **kwargs):
        return redirect(basic_auth.challenge())

    def _handle_view(self, name, **kwargs):
        """
        Override builtin _handle_view in order to redirect users when a view is not
        accessible.
        """

        if not current_user.is_authenticated:
            return redirect(url_for("security.login", next=request.url))

        if not self.is_accessible():
            abort(403)

        if not current_user.confirmed_at:
            return redirect(url_for("security.change_password", next=request.url))


class UserView(AuthModelView):
    def is_accessible(self):
        return (
                super().is_accessible()
                and current_user.has_role("superuser")
        )

    column_list = ["id", "email", "first_name", "last_name"]
    form_create_rules = ('roles', 'email', 'first_name', "last_name", "password")
    form_edit_rules = ('roles', 'email', 'first_name', "last_name")
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
    schemes_root = f"{get_project_path()}/modules/sequence_analysis/schemes"
    example_data_root = f"{get_project_path()}/static/pathogen_example_data/"

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
    form_overrides = {"scheme_path": FileUploadField, "example_data_path": FileUploadField}
    form_args = {
        "scheme_path": {
            "label": "Scheme Zip",
            "base_path": schemes_root,
            "allow_overwrite": True,
            "allowed_extensions": ["zip"],
            "validators": [scheme_validator],
        },
        "example_data_path": {
            "label": "Example Data Zip",
            "base_path": example_data_root,
            "allow_overwrite": True,
            "allowed_extensions": ["zip"],
            "description": "<b>Zip file must contain following files.</b><br/><ul><li>falldaten.csv</li><li>sequenzdaten.fasta</li><li>kontaktdaten.csv</li></ul>",
            "validators": [example_data_validator]
        }
    }

    def update_model(self, form, model):
        self.prior_scheme_name = model.scheme_name
        return super().update_model(form, model)

    def after_model_change(self, form, model, is_created):
        if self.scheme_added(model.scheme_path):
            with ZipFile(
                    path.join(self.schemes_root, model.scheme_path), "r"
            ) as archive:
                directory_name = f"{model.scheme_name}_{round(time.time() * 1000)}"
                extract_path = path.join(
                    self.schemes_root, directory_name
                )

                if not path.isdir(extract_path):
                    makedirs(extract_path)
                # only keep intended file keys in pathogen.json
                dictfilt = lambda x, y: dict([(i, x[i]) for i in x if i in set(y)])
                pathogenJson = json.loads(archive.open("pathogen.json").read())
                wanted_keys = ("pathogenJson", "treeJson", "reference")
                pathogenJson["files"] = dictfilt(pathogenJson["files"], wanted_keys)
                pathogenJsonFile = open(f"{extract_path}/pathogen.json", "w")
                pathogenJsonFile.write(json.dumps(pathogenJson))
                pathogenJsonFile.close()

                archive.extract("tree.json", path=extract_path)
                archive.extract("reference.fasta", path=extract_path)
                content = listdir(extract_path)

                if len(content) == 1:
                    sub_path = path.join(
                        self.schemes_root,
                        f"{directory_name}/{content[0]}",
                    )
                    elements = listdir(sub_path)
                    for element in elements:
                        shutil.move(path.join(sub_path, element), extract_path)
                    shutil.rmtree(sub_path)
                if self.scheme_exists(self.prior_scheme_name):
                    shutil.rmtree(path.join(self.schemes_root, self.prior_scheme_name))
                shutil.move(
                    path.join(
                        self.schemes_root,
                        directory_name,
                    ),
                    path.join(
                        self.schemes_root,
                        model.scheme_name,
                    ),
                )
            remove(path.join(self.schemes_root, model.scheme_path))
        if is_created is False and model.scheme_name and model.scheme_name != self.prior_scheme_name:
            rename(path.join(self.schemes_root, self.prior_scheme_name),
                   path.join(self.schemes_root, model.scheme_name))

    def after_model_delete(self, model):
        if path.isdir(path.join(self.schemes_root, model.scheme_name)):
            shutil.rmtree(path.join(self.schemes_root, model.scheme_name))

    def scheme_exists(self, scheme_name):
        return scheme_name and path.isdir(
            path.join(self.schemes_root, scheme_name))

    def scheme_added(self, scheme_path):
        return path.isfile(path.join(self.schemes_root, scheme_path))


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
