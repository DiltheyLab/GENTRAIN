import os
from flask import abort, send_file
from prisma.models import Pathogen
from src.config import get_project_path
from src.domains.pathogen_registry.resources import Pathogen as PathogenResource
from src.domains.pathogen_registry.services.pathogen_service import create_zip_buffer_from_scheme_directory


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


def download_example_data_action(pathogen_id: str, type: str):
    pathogen = Pathogen.prisma().find_unique(
        where={
            "id": pathogen_id,
        }
    )
    if not pathogen:
        abort(404)

    # Handle request file type based on query parameters and pathogen type
    filename = pathogen.name.lower().replace(' ', '-').replace(r'[^\w\-]', '-')

    if type == "case":
        filename += "_falldaten.csv"
    if type == "sequence" and pathogen.type == "viral":
        filename += "_sequenzdaten.fasta"
    if type == "sequence" and pathogen.type == "bacterial":
        filename += "_sequenzdaten.zip"
    if type == "contact":
        filename += "_kontaktdaten.csv"
    if not filename:
        abort(422)

    file_path = f"{get_project_path()}/data/pathogen_example_data/{str(pathogen_id)}/{filename}"
    if not os.path.exists(file_path):
        abort(404)
    return send_file(file_path, as_attachment=True, download_name=filename)
