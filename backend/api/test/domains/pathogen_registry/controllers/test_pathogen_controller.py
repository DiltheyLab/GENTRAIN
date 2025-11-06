import datetime

import pytest
from werkzeug.exceptions import NotFound

from prisma.models import Pathogen
from src.domains.pathogen_registry.controllers.pathogen_controller import get_pathogen_action
from src.domains.pathogen_registry.resources import Pathogen as PathogenResource


def test_get_pathogen_action_returns_not_found_exception(mocker):
    mock_find_unique = mocker.patch(
        "prisma.models.Pathogen.prisma"
    )
    mock_find_unique.return_value.find_unique.return_value = None
    with pytest.raises(NotFound):
        get_pathogen_action(0)
    mock_find_unique.return_value.find_unique.assert_called_once()


def test_get_pathogen_action_returns_pathogen_resource(mocker):
    pathogen = Pathogen(id=1, name='SARS-CoV-2',
                        genetic_distance_threshold=1, type="viral",
                        activated=True,
                        scheme_version=datetime.datetime(2025, 11, 6, 0,
                                                         0, 0),
                        scheme_size=1000)
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
