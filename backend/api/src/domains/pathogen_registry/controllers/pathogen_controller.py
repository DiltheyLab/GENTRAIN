import os
from flask import abort, send_file

from prisma.models import Pathogen
from src.config import get_project_path
from src.domains.pathogen_registry.resources import Pathogen as PathogenResource
from src.domains.pathogen_registry.services.pathogen_service import create_zip_buffer_from_scheme_directory, \
    get_example_data_filename


def get_all_pathogens_action():
    pathogens = Pathogen.prisma().find_many()
    return [PathogenResource(
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


def get_pathogen_action(pathogen_id: int):
    pathogen = Pathogen.prisma().find_unique(
        where={
            "id": pathogen_id,
        }
    )
    if not pathogen:
        abort(404)
    return PathogenResource(
        id=pathogen.id,
        name=pathogen.name,
        scheme_version=pathogen.scheme_version,
        type=pathogen.type,
        activated=pathogen.activated,
        genetic_distance_threshold=pathogen.genetic_distance_threshold,
        cases_example=pathogen.example_cases_key,
        contacts_example=pathogen.example_contacts_key,
        sequences_example=pathogen.example_sequences_key,
    ).model_dump()


def download_scheme_action(pathogen_id: int):
    pathogen = Pathogen.prisma().find_unique(
        where={
            "id": pathogen_id,
        }
    )
    if not pathogen:
        abort(404)
    scheme_path = f"{get_project_path()}/data/pathogen_schemes/{str(pathogen_id)}"
    if not os.path.isdir(scheme_path):
        abort(404)
    zip_buffer = create_zip_buffer_from_scheme_directory(scheme_path)
    return send_file(
        zip_buffer,
        as_attachment=True,
        download_name=f"{pathogen.name.replace(' ', '-').lower()}_scheme.zip",
        mimetype="application/zip",
    )


def download_example_data_action(pathogen_id: int, example_data_type: str):
    pathogen = Pathogen.prisma().find_unique(
        where={
            "id": pathogen_id,
        }
    )
    if not pathogen:
        abort(404)

    # Handle request file type based on query parameters and pathogen type
    filename = get_example_data_filename(pathogen, example_data_type)

    file_path = f"{get_project_path()}/data/pathogen_example_data/{str(pathogen_id)}/{filename}"
    if not os.path.exists(file_path):
        abort(404)
    return send_file(file_path, as_attachment=True, download_name=filename)
