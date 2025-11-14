import datetime
import json

import pytest
from flask import Flask

from prisma.models import Pathogen


### basic fixtures ###

@pytest.fixture
def app():
    app = Flask(__name__)
    return app


@pytest.fixture
def make_pathogen_resource():
    def _make_pathogen_resource(pathogen_id=1, name=":name:", genetic_distance_threshold=1, pathogen_type="viral",
                                activated=True, scheme_version=datetime.datetime.now(tz=datetime.timezone.utc), scheme_size=1000):
        return Pathogen(id=pathogen_id, name=name,
                        genetic_distance_threshold=genetic_distance_threshold, type=pathogen_type,
                        activated=activated,
                        scheme_version=scheme_version,
                        scheme_size=scheme_size)

    return _make_pathogen_resource
