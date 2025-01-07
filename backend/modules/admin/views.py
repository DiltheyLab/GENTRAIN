from os import path, environ

from flask import request, url_for, redirect, abort
from flask_admin.contrib import sqla
from flask_login import current_user
from flask_security import hash_password, SQLAlchemyUserDatastore

import shutil

from flask_wtf.file import FileField, FileAllowed

from backend.app import db, basic_auth
from backend.modules.admin.strategies.example_data_processor.bacterial_example_data_processor import \
    BacterialExampleDataProcessor
from backend.modules.admin.strategies.example_data_processor.viral_example_data_processor import \
    ViralExampleDataProcessor
from backend.modules.admin.strategies.example_data_validator.bacterial_example_data_validator import \
    BacterialExampleDataValidator
from backend.modules.admin.strategies.scheme_processor.bacterial_scheme_processor import BacterialSchemeProcessor
from backend.modules.admin.strategies.scheme_processor.viral_scheme_processor import ViralSchemeProcessor
from backend.modules.admin.validators.example_data import validate_cases_example, validate_contacts_example, \
    validate_sequences_example
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
    form_extra_fields = {
        'scheme': FileField('Schema', validators=[FileAllowed(['zip']), scheme_validator]),
        'cases_example': FileField('Cases Example', validators=[FileAllowed(['csv']), validate_cases_example]),
        'sequences_example': FileField('Sequences Example',
                                       validators=[FileAllowed(['fasta', 'zip']), validate_sequences_example]),
        'contacts_example': FileField('Contacts Example', validators=[FileAllowed(['csv']), validate_contacts_example])
    }

    def update_model(self, form, model):
        self.prior_scheme_name = model.scheme_name
        return super().update_model(form, model)

    def after_model_change(self, form, model, is_created):
        example_data_processor = ViralExampleDataProcessor(model, form) if model.type == "viral" else BacterialExampleDataProcessor(model, form)
        example_data_processor.store_example_data()

        scheme_processor = ViralSchemeProcessor(model,
                                                self.prior_scheme_name) if model.type == "viral" else BacterialSchemeProcessor(
            model, self.prior_scheme_name)
        scheme_processor.extract_scheme()
        if is_created is False:
            scheme_processor.rename_scheme_directory_on_name_change()
        else:
            scheme_processor.remove_prior_scheme_directory()

    def after_model_delete(self, model):
        if path.isdir(path.join(self.schemes_root, model.scheme_name)):
            shutil.rmtree(path.join(self.schemes_root, model.scheme_name))


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
