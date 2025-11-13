import datetime
import io

import pytest
from flask import Flask
from werkzeug.exceptions import NotFound

from prisma.models import Pathogen
from src.domains.pathogen_registry.controllers.pathogen_controller import get_pathogen_action, get_all_pathogens_action, \
    download_scheme_action
from src.domains.pathogen_registry.resources import Pathogen as PathogenResource


### basic fixtures ###

@pytest.fixture
def app():
    app = Flask(__name__)
    return app


@pytest.fixture
def make_pathogen_resource():
    def _make_pathogen_resource(pathogen_id=1, name=":name:", genetic_distance_threshold=1, pathogen_type="viral",
                                activated=True,
                                scheme_version=datetime.datetime(2025, 11, 6, 0,
                                                                 0, 0), scheme_size=1000):
        return Pathogen(id=pathogen_id, name=name,
                        genetic_distance_threshold=genetic_distance_threshold, type=pathogen_type,
                        activated=activated,
                        scheme_version=scheme_version,
                        scheme_size=scheme_size)

    return _make_pathogen_resource


### get_all_pathogens_action ###

def test_get_all_pathogens_action_returns_empty_list_if_no_pathogens_exist(mocker):
    mock_find_unique = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_find_unique.return_value.find_many.return_value = []
    response = get_all_pathogens_action()
    assert response == []
    mock_find_unique.return_value.find_many.assert_called_once()


def test_get_all_pathogens_action_returns_pathogen_resource_list(mocker, make_pathogen_resource):
    pathogens = [make_pathogen_resource(pathogen_id=1, name=":pathogen_1:", pathogen_type="viral"),
                 make_pathogen_resource(pathogen_id=2, name=":pathogen_2:", pathogen_type="viral"),
                 make_pathogen_resource(pathogen_id=3, name=":pathogen_3:", pathogen_type="bacterial")]
    mock_pathogen_prisma = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_many.return_value = pathogens
    response = get_all_pathogens_action()
    pathogen_resources = [PathogenResource(
        id=pathogen.id,
        name=pathogen.name,
        scheme_version=pathogen.scheme_version,
        type=pathogen.type,
        activated=pathogen.activated,
        genetic_distance_threshold=pathogen.genetic_distance_threshold,
        cases_example=pathogen.example_cases_key,
        contacts_example=pathogen.example_contacts_key,
        sequences_example=pathogen.example_sequences_key,
    ).model_dump() for pathogen in pathogens]
    assert response == pathogen_resources
    mock_pathogen_prisma.return_value.find_many.assert_called_once()


### get_pathogen_action ###

def test_get_pathogen_action_returns_not_found_exception_if_pathogen_does_not_exist(mocker):
    mock_pathogen_prisma = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = None
    with pytest.raises(NotFound):
        get_pathogen_action(0)
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()


def test_get_pathogen_action_returns_single_pathogen_resource(mocker, make_pathogen_resource):
    pathogen = make_pathogen_resource()
    mock_pathogen_prisma = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    response = get_pathogen_action(1)
    pathogen_resource = PathogenResource(
        id=pathogen.id,
        name=pathogen.name,
        scheme_version=pathogen.scheme_version,
        type=pathogen.type,
        activated=pathogen.activated,
        genetic_distance_threshold=pathogen.genetic_distance_threshold,
        cases_example=pathogen.example_cases_key,
        contacts_example=pathogen.example_contacts_key,
        sequences_example=pathogen.example_sequences_key,
    )
    assert response == pathogen_resource.model_dump()
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()


### download_schema_action ###

@pytest.fixture
def mock_success_setup_for_download_schema_action(mocker, make_pathogen_resource):
    pathogen = make_pathogen_resource()
    mock_pathogen_prisma = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_isdir = mocker.patch("os.path.isdir", return_value=True)
    mock_create_zip_buffer_from_scheme_directory = mocker.patch(
        "src.domains.pathogen_registry.controllers.pathogen_controller.create_zip_buffer_from_scheme_directory",
        return_value=io.BytesIO())
    return {
        "pathogen": pathogen,
        "pathogen_prisma": mock_pathogen_prisma,
        "isdir": mock_isdir,
        "create_zip_buffer_from_scheme_directory": mock_create_zip_buffer_from_scheme_directory,
    }


def test_download_scheme_action_returns_not_found_exception_if_pathogen_does_not_exist(mocker):
    mock_pathogen_prisma = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = None
    with pytest.raises(NotFound):
        download_scheme_action(0)
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()


def test_download_scheme_action_returns_not_found_exception_if_scheme_directory_does_not_exist(app, mocker,
                                                                                               make_pathogen_resource):
    pathogen = make_pathogen_resource()
    mock_pathogen_prisma = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
    mock_isdir = mocker.patch("os.path.isdir", return_value=False)
    with pytest.raises(NotFound):
        download_scheme_action(0)
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()
    mock_isdir.assert_called_once()


def test_download_scheme_action_returns_success_status_if_pathogen_and_scheme_directory_exists(app,
                                                                                                    mock_success_setup_for_download_schema_action):
    with app.test_request_context():
        response = download_scheme_action(0)
        assert response.status_code == 200
    mock_success_setup_for_download_schema_action["pathogen_prisma"].return_value.find_unique.assert_called_once()
    mock_success_setup_for_download_schema_action["isdir"].assert_called_once()
    mock_success_setup_for_download_schema_action["create_zip_buffer_from_scheme_directory"].assert_called_once()

def test_download_scheme_action_response_has_correct_content_disposition_header_if_pathogen_and_scheme_directory_exists(app,
                                                                                                    mock_success_setup_for_download_schema_action):
    with app.test_request_context():
        response = download_scheme_action(0)
        assert response.headers.get('Content-Disposition') == f"attachment; filename=\"{mock_success_setup_for_download_schema_action['pathogen'].name}_scheme.zip\""
    mock_success_setup_for_download_schema_action["pathogen_prisma"].return_value.find_unique.assert_called_once()
    mock_success_setup_for_download_schema_action["isdir"].assert_called_once()
    mock_success_setup_for_download_schema_action["create_zip_buffer_from_scheme_directory"].assert_called_once()

def test_download_scheme_action_response_has_correct_content_type_if_pathogen_and_scheme_directory_exists(app,
                                                                                                    mock_success_setup_for_download_schema_action):
    with app.test_request_context():
        response = download_scheme_action(0)
        assert response.headers.get('Content-Type') == "application/zip"
    mock_success_setup_for_download_schema_action["pathogen_prisma"].return_value.find_unique.assert_called_once()
    mock_success_setup_for_download_schema_action["isdir"].assert_called_once()
    mock_success_setup_for_download_schema_action["create_zip_buffer_from_scheme_directory"].assert_called_once()

