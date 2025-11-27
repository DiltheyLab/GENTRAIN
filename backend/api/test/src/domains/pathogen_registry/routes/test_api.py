import io

import pytest
from flask import make_response, send_file

from src.domains.pathogen_registry.resources import Pathogen as PathogenResource
from src.domains.pathogen_registry.routes.api import (
    get_all_pathogens,
    get_pathogen,
    download_scheme,
    download_example_data,
)


### get_all_pathogens (/pathogens) ###


def test_pathogens_endpoint_returns_pathogen_resources_as_flask_response(
    mocker, app, make_pathogen
):
    with app.test_request_context():
        pathogens = [
            make_pathogen(pathogen_id=1, name=":pathogen_1:", pathogen_type="viral"),
            make_pathogen(pathogen_id=2, name=":pathogen_2:", pathogen_type="viral"),
            make_pathogen(
                pathogen_id=3, name=":pathogen_3:", pathogen_type="bacterial"
            ),
        ]
        expected_response = make_response(
            [
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
        )
        mock_get_all_pathogen_action = mocker.patch(
            "src.domains.pathogen_registry.routes.api.get_all_pathogens_action",
            return_value=expected_response,
        )
        response = get_all_pathogens()
        assert response == expected_response
        mock_get_all_pathogen_action.assert_called_once()


### get_pathogen (/pathogens/<id>) ###


@pytest.mark.parametrize("pathogen_type", ["viral", "bacterial"])
def test_pathogen_endpoint_returns_pathogen_resource_as_flask_response(
    mocker, app, make_pathogen, pathogen_type
):
    with app.test_request_context():
        pathogen = make_pathogen(
            pathogen_id=1, name=":pathogen_1:", pathogen_type=pathogen_type
        )
        expected_response = make_response(
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
        )
        mock_get_pathogen_action = mocker.patch(
            "src.domains.pathogen_registry.routes.api.get_pathogen_action",
            return_value=expected_response,
        )
        response = get_pathogen(1)
        assert response == expected_response
        mock_get_pathogen_action.assert_called_once()


### download_scheme (/pathogens/<id>/scheme) ###


@pytest.mark.parametrize("pathogen_type", ["viral", "bacterial"])
def test_pathogen_scheme_endpoint_returns_file_response(
    app, mocker, make_pathogen, pathogen_type
):
    with app.test_request_context():
        pathogen = make_pathogen(
            pathogen_id=1, name=":pathogen_1:", pathogen_type=pathogen_type
        )
        expected_response = send_file(
            io.BytesIO(),
            as_attachment=True,
            download_name=f"{pathogen.name.replace(' ', '-').lower()}_scheme.zip",
            mimetype="application/zip",
        )
        mock_download_scheme_action = mocker.patch(
            "src.domains.pathogen_registry.routes.api.download_scheme_action",
            return_value=expected_response,
        )
        response = download_scheme(1)
        assert response == expected_response
        mock_download_scheme_action.assert_called_once()


### download_example_data (/pathogens/<id>/example_data) ###


@pytest.mark.parametrize(
    "pathogen_type, example_data_type, file_pattern, mimetype",
    [
        ("viral", "case", "falldaten.csv", "text/csv"),
        ("viral", "contact", "kontaktdaten.csv", "text/csv"),
        ("viral", "sequence", "falldaten.fasta", "mimetype/octet-stream"),
        ("bacterial", "case", "falldaten.csv", "text/csv"),
        ("bacterial", "contact", "kontaktdaten.csv", "text/csv"),
        ("bacterial", "sequence", "falldaten.zip", "mimetype/zip"),
    ],
)
def test_pathogen_example_data_endpoint_returns_file_response(
    app, mocker, make_pathogen, pathogen_type, example_data_type, file_pattern, mimetype
):
    with app.test_request_context():
        pathogen = make_pathogen(
            pathogen_id=1, name=":pathogen_1:", pathogen_type=pathogen_type
        )
        expected_response = send_file(
            io.BytesIO(),
            as_attachment=True,
            download_name=f"{pathogen.name.replace(' ', '-').lower()}_{file_pattern}",
            mimetype=mimetype,
        )
        mock_download_example_data_action = mocker.patch(
            "src.domains.pathogen_registry.routes.api.download_example_data_action",
            return_value=expected_response,
        )
        response = download_example_data(1, example_data_type)
        assert response == expected_response
        mock_download_example_data_action.assert_called_once()
