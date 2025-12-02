import json

import pytest
from werkzeug.exceptions import NotFound, UnprocessableEntity
from src.domains.pathogen_registry.controllers.pathogen_controller import (
    get_pathogen_action,
    get_all_pathogens_action,
    download_scheme_action,
    download_example_data_action,
)
from src.domains.pathogen_registry.resources import Pathogen as PathogenResource
from src.domains.pathogen_registry.services.pathogen_service import (
    get_example_data_filename,
)


### get_all_pathogens_action ###


def test_get_all_pathogens_action_returns_empty_list_if_no_pathogens_exist(app, mocker):
    mock_find_unique = mocker.patch("prisma.models.Pathogen.prisma")
    mock_find_unique.return_value.find_many.return_value = []
    with app.test_request_context():
        response = get_all_pathogens_action()
        assert response.json == []
    mock_find_unique.return_value.find_many.assert_called_once()


def test_get_all_pathogens_action_returns_success_stats(app, mocker, make_pathogen):
    with app.test_request_context():
        pathogens = [
            make_pathogen(pathogen_id=1, name=":pathogen_1:", pathogen_type="viral"),
            make_pathogen(pathogen_id=2, name=":pathogen_2:", pathogen_type="viral"),
            make_pathogen(
                pathogen_id=3, name=":pathogen_3:", pathogen_type="bacterial"
            ),
        ]
        mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
        mock_pathogen_prisma.return_value.find_many.return_value = pathogens
        response = get_all_pathogens_action()
        assert response.status_code == 200
        mock_pathogen_prisma.return_value.find_many.assert_called_once()


def test_get_all_pathogens_action_returns_pathogen_resource_list(
    app, mocker, make_pathogen
):
    with app.test_request_context():
        pathogens = [
            make_pathogen(pathogen_id=1, name=":pathogen_1:", pathogen_type="viral"),
            make_pathogen(pathogen_id=2, name=":pathogen_2:", pathogen_type="viral"),
            make_pathogen(
                pathogen_id=3, name=":pathogen_3:", pathogen_type="bacterial"
            ),
        ]
        mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
        mock_pathogen_prisma.return_value.find_many.return_value = pathogens
        pathogen_resources = [
            PathogenResource(
                id=pathogen.id,
                name=pathogen.name,
                scheme_version=pathogen.scheme_version,
                type=pathogen.type,
                activated=pathogen.activated,
                genetic_distance_threshold=pathogen.genetic_distance_threshold,
                cases_example=pathogen.example_cases_key,
                contacts_example=pathogen.example_contacts_key,
                sequences_example=pathogen.example_sequences_key,
            ).model_dump(mode="json")
            for pathogen in pathogens
        ]
        response = get_all_pathogens_action()
        assert response.json == pathogen_resources
        mock_pathogen_prisma.return_value.find_many.assert_called_once()


### get_pathogen_action ###


def test_get_pathogen_action_returns_not_found_exception_if_pathogen_does_not_exist(
    mocker,
):
    mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
    mock_pathogen_prisma.return_value.find_unique.return_value = None
    with pytest.raises(NotFound):
        get_pathogen_action(0)
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()


def test_get_pathogen_action_returns_single_pathogen_resource(
    app, mocker, make_pathogen
):
    with app.test_request_context():
        pathogen = make_pathogen()
        mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
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
        assert response.json == pathogen_resource.model_dump(mode="json")
        mock_pathogen_prisma.return_value.find_unique.assert_called_once()


def test_get_pathogen_action_returns_success_status(app, mocker, make_pathogen):
    with app.test_request_context():
        pathogen = make_pathogen()
        mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
        mock_pathogen_prisma.return_value.find_unique.return_value = pathogen
        response = get_pathogen_action(1)
        assert response.status_code == 200
        mock_pathogen_prisma.return_value.find_unique.assert_called_once()


### download_schema_action ###


def test_download_scheme_action_returns_not_found_exception_if_pathogen_does_not_exist(
    mocker,
):
    mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
    mock_pathogen_prisma.return_value.find_unique.return_value = None
    with pytest.raises(NotFound):
        download_scheme_action(0)
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()


def test_download_scheme_action_returns_not_found_exception_if_scheme_directory_does_not_exist(
    mocker, make_pathogen
):
    mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
    mock_pathogen_prisma.return_value.find_unique.return_value = make_pathogen()
    mock_isdir = mocker.patch("os.path.isdir", return_value=False)
    with pytest.raises(NotFound):
        download_scheme_action(0)
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()
    mock_isdir.assert_called_once()


def test_download_scheme_action_returns_success_status_if_pathogen_and_scheme_directory_exist(
    app, mock_success_setup_for_download_schema_action
):
    with app.test_request_context():
        response = download_scheme_action(
            mock_success_setup_for_download_schema_action["pathogen"].id
        )
        assert response.status_code == 200
        mock_success_setup_for_download_schema_action[
            "pathogen_prisma"
        ].return_value.find_unique.assert_called_once()
        mock_success_setup_for_download_schema_action["isdir"].assert_called_once()
        mock_success_setup_for_download_schema_action[
            "create_zip_buffer_from_scheme_directory"
        ].assert_called_once()


def test_download_scheme_action_response_has_correct_content_disposition_header_if_pathogen_and_scheme_directory_exist(
    app, mock_success_setup_for_download_schema_action
):
    with app.test_request_context():
        response = download_scheme_action(
            mock_success_setup_for_download_schema_action["pathogen"].id
        )
        # replace quotes in filename as flasks send_file method might add quotes in the presence of special chars
        disposition_header = response.headers.get("Content-Disposition")
        assert (
            disposition_header
            and disposition_header.replace('"', "")
            == f"attachment; filename={mock_success_setup_for_download_schema_action['pathogen'].name}_scheme.zip"
        )
        mock_success_setup_for_download_schema_action[
            "pathogen_prisma"
        ].return_value.find_unique.assert_called_once()
        mock_success_setup_for_download_schema_action["isdir"].assert_called_once()
        mock_success_setup_for_download_schema_action[
            "create_zip_buffer_from_scheme_directory"
        ].assert_called_once()


def test_download_scheme_action_response_has_correct_content_type_if_pathogen_and_scheme_directory_exist(
    app, mock_success_setup_for_download_schema_action
):
    with app.test_request_context():
        response = download_scheme_action(
            mock_success_setup_for_download_schema_action["pathogen"].id
        )
        assert response.headers.get("Content-Type") == "application/zip"
        mock_success_setup_for_download_schema_action[
            "pathogen_prisma"
        ].return_value.find_unique.assert_called_once()
        mock_success_setup_for_download_schema_action["isdir"].assert_called_once()
        mock_success_setup_for_download_schema_action[
            "create_zip_buffer_from_scheme_directory"
        ].assert_called_once()


### download_example_data_action ###


@pytest.mark.parametrize("example_data_type", ["case", "contact", "sequence"])
def test_download_example_data_action_returns_not_found_exception_if_pathogen_does_not_exist(
    mocker, example_data_type
):
    mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
    mock_pathogen_prisma.return_value.find_unique.return_value = None
    with pytest.raises(NotFound):
        download_example_data_action(0, example_data_type)
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()


def test_download_example_data_action_returns_unprocessable_entity_exception_if_pathogen_type_is_invalid(
    mocker, make_pathogen
):
    mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
    mock_pathogen_prisma.return_value.find_unique.return_value = make_pathogen()
    with pytest.raises(UnprocessableEntity):
        download_example_data_action(0, ":invalid_type:")
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()


@pytest.mark.parametrize("example_data_type", ["case", "contact", "sequence"])
def test_download_example_data_action_returns_not_found_exception_if_file_does_not_exist(
    mocker,
    mock_success_setup_for_download_example_data_action,
    make_pathogen,
    example_data_type,
):
    mock_pathogen_prisma = mocker.patch("prisma.models.Pathogen.prisma")
    mock_pathogen_prisma.return_value.find_unique.return_value = make_pathogen()
    mock_exists = mocker.patch("os.path.exists", return_value=False)

    with pytest.raises(NotFound):
        download_example_data_action(0, example_data_type)
    mock_pathogen_prisma.return_value.find_unique.assert_called_once()
    mock_exists.assert_called_once()


@pytest.mark.parametrize(
    "mock_success_setup_for_download_example_data_action, example_data_type",
    [
        ("viral", "case"),
        ("viral", "contact"),
        ("viral", "sequence"),
        ("bacterial", "case"),
        ("bacterial", "contact"),
        ("bacterial", "sequence"),
    ],
    indirect=["mock_success_setup_for_download_example_data_action"],
)
def test_download_scheme_action_returns_success_status_if_pathogen_and_file_exist(
    app, mock_success_setup_for_download_example_data_action, example_data_type
):
    with app.test_request_context():
        response = download_example_data_action(
            mock_success_setup_for_download_example_data_action["pathogen"].id,
            example_data_type,
        )
        assert response.status_code == 200
        mock_success_setup_for_download_example_data_action[
            "pathogen_prisma"
        ].return_value.find_unique.assert_called_once()
        mock_success_setup_for_download_example_data_action[
            "exists"
        ].assert_called_once()
        mock_success_setup_for_download_example_data_action[
            "get_project_path"
        ].assert_called_once()


@pytest.mark.parametrize(
    "mock_success_setup_for_download_example_data_action, example_data_type",
    [
        ("viral", "case"),
        ("viral", "contact"),
        ("viral", "sequence"),
        ("bacterial", "case"),
        ("bacterial", "contact"),
        ("bacterial", "sequence"),
    ],
    indirect=["mock_success_setup_for_download_example_data_action"],
)
def test_download_scheme_action_response_has_correct_content_disposition_header_if_pathogen_and_file_exist(
    app, mock_success_setup_for_download_example_data_action, example_data_type
):
    filename = get_example_data_filename(
        mock_success_setup_for_download_example_data_action["pathogen"],
        example_data_type,
    )
    with app.test_request_context():
        response = download_example_data_action(
            mock_success_setup_for_download_example_data_action["pathogen"].id,
            example_data_type,
        )
        # replace quotes in filename as flasks send_file method might add quotes in the presence of special chars
        content_disposition_header = response.headers.get("Content-Disposition")
        assert (
            content_disposition_header
            and content_disposition_header.replace('"', "")
            == f"attachment; filename={filename}"
        )
        mock_success_setup_for_download_example_data_action[
            "pathogen_prisma"
        ].return_value.find_unique.assert_called_once()
        mock_success_setup_for_download_example_data_action[
            "exists"
        ].assert_called_once()
        mock_success_setup_for_download_example_data_action[
            "get_project_path"
        ].assert_called_once()


@pytest.mark.parametrize(
    "mock_success_setup_for_download_example_data_action, example_data_type, correct_content_type",
    [
        ("viral", "case", "text/csv; charset=utf-8"),
        ("viral", "contact", "text/csv; charset=utf-8"),
        ("viral", "sequence", "application/octet-stream"),
        ("bacterial", "case", "text/csv; charset=utf-8"),
        ("bacterial", "contact", "text/csv; charset=utf-8"),
        ("bacterial", "sequence", "application/zip"),
    ],
    indirect=["mock_success_setup_for_download_example_data_action"],
)
def test_download_scheme_action_response_has_correct_content_type_if_pathogen_and_file_exist(
    app,
    mock_success_setup_for_download_example_data_action,
    example_data_type,
    correct_content_type,
):
    with app.test_request_context():
        response = download_example_data_action(
            mock_success_setup_for_download_example_data_action["pathogen"].id,
            example_data_type,
        )
        # replace quotes in filename as flasks send_file method might add quotes in the presence of special chars
        assert response.headers.get("Content-Type") == correct_content_type
        mock_success_setup_for_download_example_data_action[
            "pathogen_prisma"
        ].return_value.find_unique.assert_called_once()
        mock_success_setup_for_download_example_data_action[
            "exists"
        ].assert_called_once()
        mock_success_setup_for_download_example_data_action[
            "get_project_path"
        ].assert_called_once()
