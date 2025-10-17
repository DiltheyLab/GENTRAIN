from prisma.models import pathogen
from os import environ


def serialize_pathogen(pathogen: pathogen):
    pathogen = pathogen.dict()

    # Assemble example data paths
    pathogen["cases_example"] = (
        (
            f"{environ.get('ADMIN_PANEL_URL')}/example_data/{pathogen['example_cases_key']}"
        )
        if pathogen["example_cases_key"]
        else None
    )
    pathogen["sequences_example"] = (
        (
            f"{environ.get('ADMIN_PANEL_URL')}/example_data/{pathogen['example_sequences_key']}"
        )
        if pathogen["example_sequences_key"]
        else None
    )
    pathogen["contacts_example"] = (
        (
            f"{environ.get('ADMIN_PANEL_URL')}/example_data/{pathogen['example_contacts_key']}"
        )
        if pathogen["example_contacts_key"]
        else None
    )

    # Remove unnecessary fields and upload overhead from API response
    del pathogen["example_cases_key"]
    del pathogen["example_sequences_key"]
    del pathogen["example_contacts_key"]
    del pathogen["example_cases_bucket"]
    del pathogen["example_sequences_bucket"]
    del pathogen["example_contacts_bucket"]
    del pathogen["example_cases_size"]
    del pathogen["example_sequences_size"]
    del pathogen["example_contacts_size"]
    del pathogen["scheme_size"]

    return pathogen
