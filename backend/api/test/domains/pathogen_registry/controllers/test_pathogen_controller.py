import datetime

import pytest
from werkzeug.exceptions import NotFound

from prisma.models import Pathogen
from src.domains.pathogen_registry.controllers.pathogen_controller import get_pathogen_action, get_all_pathogens_action
from src.domains.pathogen_registry.resources import Pathogen as PathogenResource


@pytest.fixture
def make_pathogen_resource():
    def _make_pathogen_resource(id=1, name=":name:", genetic_distance_threshold=1, type="viral", activated=True,
                                scheme_version=datetime.datetime(2025, 11, 6, 0,
                                                                 0, 0), scheme_size=1000):
        return Pathogen(id=id, name=name,
                        genetic_distance_threshold=genetic_distance_threshold, type=type,
                        activated=activated,
                        scheme_version=scheme_version,
                        scheme_size=scheme_size)

    return _make_pathogen_resource


def test_get_all_pathogen_action_returns_empty_list(mocker):
    mock_find_unique = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_find_unique.return_value.find_many.return_value = []
    response = get_all_pathogens_action()
    assert response == []
    mock_find_unique.return_value.find_many.assert_called_once()


def test_get_all_pathogen_action_returns_pathogen_resource_list(mocker, make_pathogen_resource):
    pathogens = [make_pathogen_resource(id=1, name=":pathogen_1:", type="viral"),
                 make_pathogen_resource(id=2, name=":pathogen_2:", type="viral"),
                 make_pathogen_resource(id=3, name=":pathogen_3:", type="bacterial")]
    mock_find_unique = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_find_unique.return_value.find_many.return_value = pathogens
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
    mock_find_unique.return_value.find_many.assert_called_once()


def test_get_pathogen_action_returns_not_found_exception(mocker):
    mock_find_unique = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_find_unique.return_value.find_unique.return_value = None
    with pytest.raises(NotFound):
        get_pathogen_action(0)
    mock_find_unique.return_value.find_unique.assert_called_once()


def test_get_pathogen_action_returns_single_pathogen_resource(mocker, make_pathogen_resource):
    pathogen = make_pathogen_resource()
    mock_find_unique = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_find_unique.return_value.find_unique.return_value = pathogen
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
    mock_find_unique.return_value.find_unique.assert_called_once()
