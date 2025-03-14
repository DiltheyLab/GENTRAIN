from os import path, environ, listdir
from os.path import isfile

from flask import request, url_for, redirect, abort, current_app
from flask_admin.contrib import sqla
from flask_login import current_user
from flask_security import hash_password, SQLAlchemyUserDatastore

import shutil

from flask_wtf.file import FileField, FileAllowed
from pydantic.v1.utils import path_types
from werkzeug.utils import secure_filename

from backend.app import db, basic_auth
from backend.modules.admin.strategies.example_data_processor.bacterial_example_data_processor import \
    BacterialExampleDataProcessor
from backend.modules.admin.strategies.example_data_processor.viral_example_data_processor import \
    ViralExampleDataProcessor
from backend.modules.admin.strategies.scheme_processor.bacterial_scheme_processor import BacterialSchemeProcessor
from backend.modules.admin.strategies.scheme_processor.viral_scheme_processor import ViralSchemeProcessor
from backend.modules.admin.validators.example_data import cases_example_validator, sequences_example_validator, \
    contacts_example_validator
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

    column_list = ["id", "email"]
    form_create_rules = ('roles', 'email', "password")
    form_edit_rules = ('roles', 'email')
    edit_template = 'admin/edit.html'
    create_template = 'admin/create.html'

    def create_model(self, form):
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)
        user_datastore.create_user(
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
        'cases_example': FileField('Cases Example', validators=[FileAllowed(['csv']), cases_example_validator]),
        'sequences_example': FileField('Sequences Example', validators=[sequences_example_validator]),
        'contacts_example': FileField('Contacts Example', validators=[FileAllowed(['csv']), contacts_example_validator])
    }

    def edit_form(self, obj=None):
        form = super().edit_form(obj=obj)
        if obj:
            scheme_path = path.join(get_project_path(),
                                    f"modules/sequence_analysis/schemes/{secure_filename(obj.scheme_name)}")
            # if a directory for the scheme_path of the pathogen exists we do not provide a download link since temporary
            # zip files might be very large
            if path.isdir(scheme_path):
                form.scheme.description = f"Scheme was uploaded."
            # add download links for all example data if uploaded
            form.cases_example.description = render_file_download_if_file_exists(
                f"static/pathogen_example_data/{obj.name}/falldaten.csv", "falldaten.csv")
            form.sequences_example.description = render_file_download_if_file_exists(
                f"static/pathogen_example_data/{obj.name}/sequenzdaten.fasta", "sequenzdaten.fasta")
            form.contacts_example.description = render_file_download_if_file_exists(
                f"static/pathogen_example_data/{obj.name}/kontaktdaten.csv", "kontaktdaten.csv")
            return form

    def update_model(self, form, model):
        self.prior_scheme_name = model.scheme_name
        return super().update_model(form, model)

    def after_model_change(self, form, model, is_created):
        example_data_processor = ViralExampleDataProcessor(model,
                                                           form) if model.type == "viral" else BacterialExampleDataProcessor(
            model, form)
        example_data_processor.store_example_data()

        scheme_processor = ViralSchemeProcessor(model,
                                                self.prior_scheme_name) if model.type == "viral" else BacterialSchemeProcessor(
            model, self.prior_scheme_name)
        scheme_processor.extract_scheme()
        if is_created is False:
            scheme_processor.rename_scheme_directory_on_name_change()

    def after_model_delete(self, model):
        scheme_processor = ViralSchemeProcessor(model,
                                                self.prior_scheme_name) if model.type == "viral" else BacterialSchemeProcessor(
            model, self.prior_scheme_name)
        if path.isdir(scheme_processor.get_scheme_name_directory()):
            shutil.rmtree(scheme_processor.get_scheme_name_directory())


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


def render_file_download_if_file_exists(file_path, name):
    return f"Current: <a href='/{file_path}' download>{name}</a>" if path.isfile(
        path.join(get_project_path(), file_path)) or path.isdir(path.join(get_project_path(), file_path)) else None
