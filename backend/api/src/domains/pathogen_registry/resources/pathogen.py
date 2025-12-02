from datetime import datetime
from os import environ
from pydantic import BaseModel, field_serializer
from typing import Optional


class Pathogen(BaseModel):
    id: int
    name: str
    scheme_version: Optional[datetime]
    type: str
    activated: bool
    genetic_distance_threshold: int
    cases_example: Optional[str] = None
    contacts_example: Optional[str] = None
    sequences_example: Optional[str] = None

    @field_serializer('cases_example', 'sequences_example', 'contacts_example')
    def get_example_file(self, path: str):
        return (
            f"{environ.get('ADMIN_PANEL_URL')}/example_data/{path}"
        ) if path else None
