from flask import make_response

from src.domains.pathogen_registry.resources import Pathogen as PathogenResource
from src.domains.pathogen_registry.routes.api import get_all_pathogens, get_pathogen


### get_all_pathogens (/pathogens) ###

def test_pathogens_endpoint_returns_success_status(mocker, app, make_pathogen_resource):
    with app.test_request_context():
        pathogens = [make_pathogen_resource(pathogen_id=1, name=":pathogen_1:", pathogen_type="viral"),
                     make_pathogen_resource(pathogen_id=2, name=":pathogen_2:", pathogen_type="viral"),
                     make_pathogen_resource(pathogen_id=3, name=":pathogen_3:", pathogen_type="bacterial")]
        mock_get_all_pathogen_action = mocker.patch(
            "src.domains.pathogen_registry.routes.api.get_all_pathogens_action",
            return_value=make_response([PathogenResource(
                id=pathogen.id,
                name=pathogen.name,
                scheme_version=pathogen.scheme_version,
                type=pathogen.type,
                activated=pathogen.activated,
                genetic_distance_threshold=pathogen.genetic_distance_threshold,
                cases_example=pathogen.example_cases_key,
                contacts_example=pathogen.example_contacts_key,
                sequences_example=pathogen.example_sequences_key,
            ).model_dump(mode="json") for pathogen in pathogens]))
        response = get_all_pathogens()
        assert response.status_code == 200
        mock_get_all_pathogen_action.assert_called_once()


def test_pathogens_endpoint_returns_pathogen_resources_as_flask_response(mocker, app, make_pathogen_resource):
    with app.test_request_context():
        pathogens = [make_pathogen_resource(pathogen_id=1, name=":pathogen_1:", pathogen_type="viral"),
                     make_pathogen_resource(pathogen_id=2, name=":pathogen_2:", pathogen_type="viral"),
                     make_pathogen_resource(pathogen_id=3, name=":pathogen_3:", pathogen_type="bacterial")]
        expected_response = make_response([PathogenResource(
            id=pathogen.id,
            name=pathogen.name,
            scheme_version=pathogen.scheme_version,
            type=pathogen.type,
            activated=pathogen.activated,
            genetic_distance_threshold=pathogen.genetic_distance_threshold,
            cases_example=pathogen.example_cases_key,
            contacts_example=pathogen.example_contacts_key,
            sequences_example=pathogen.example_sequences_key,
        ).model_dump(mode="json") for pathogen in pathogens])
        mock_get_all_pathogen_action = mocker.patch(
            "src.domains.pathogen_registry.routes.api.get_all_pathogens_action",
            return_value=expected_response)
        response = get_all_pathogens()
        assert response == expected_response
        mock_get_all_pathogen_action.assert_called_once()


### get_pathogen (/pathogens/<id>) ###

def test_pathogen_endpoint_returns_success_status(mocker, app, make_pathogen_resource):
    with app.test_request_context():
        pathogen = make_pathogen_resource(pathogen_id=1, name=":pathogen_1:", pathogen_type="viral")
        mock_get_pathogen_action = mocker.patch(
            "src.domains.pathogen_registry.routes.api.get_pathogen_action",
            return_value=make_response(PathogenResource(
                id=pathogen.id,
                name=pathogen.name,
                scheme_version=pathogen.scheme_version,
                type=pathogen.type,
                activated=pathogen.activated,
                genetic_distance_threshold=pathogen.genetic_distance_threshold,
                cases_example=pathogen.example_cases_key,
                contacts_example=pathogen.example_contacts_key,
                sequences_example=pathogen.example_sequences_key,
            ).model_dump(mode="json")))
        response = get_pathogen(1)
        assert response.status_code == 200
        mock_get_pathogen_action.assert_called_once()


def test_pathogen_endpoint_returns_pathogen_resource_as_flask_response(mocker, app, make_pathogen_resource):
    with app.test_request_context():
        pathogen = make_pathogen_resource(pathogen_id=1, name=":pathogen_1:", pathogen_type="viral")
        expected_response = make_response(PathogenResource(
            id=pathogen.id,
            name=pathogen.name,
            scheme_version=pathogen.scheme_version,
            type=pathogen.type,
            activated=pathogen.activated,
            genetic_distance_threshold=pathogen.genetic_distance_threshold,
            cases_example=pathogen.example_cases_key,
            contacts_example=pathogen.example_contacts_key,
            sequences_example=pathogen.example_sequences_key,
        ).model_dump(mode="json"))
        mock_get_pathogen_action = mocker.patch(
            "src.domains.pathogen_registry.routes.api.get_pathogen_action",
            return_value=expected_response)
        response = get_pathogen(1)
        assert response == expected_response
        mock_get_pathogen_action.assert_called_once()
