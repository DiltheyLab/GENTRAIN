import os
import zipfile
import io

from prisma.models import Pathogen
from src.domains.pathogen_registry.exceptions import NestedZipException, InvalidPathogenTypeException, \
    InvalidExampleDataTypeException


def create_zip_buffer_from_scheme_directory(scheme_path: str):
    if not os.path.exists(scheme_path):
        raise NotADirectoryError
    files = os.listdir(scheme_path)
    if len(files) == 0:
        raise FileNotFoundError
    if any(".zip" in filename for filename in files):
        raise NestedZipException

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
        for root, dirs, files in os.walk(scheme_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_name = os.path.relpath(file_path, start=scheme_path)
                zip_file.write(file_path, file_name)
    buffer.seek(0)
    return buffer


def get_example_data_filename(pathogen: Pathogen, example_data_type: str):
    filename = ""
    pathogen_slug = pathogen.name.lower().replace(' ', '-').replace(r'[^\w\-]', '-')
    match example_data_type:
        case "case":
            filename = f"{pathogen_slug}_falldaten.csv"
        case "sequence":
            if pathogen.type != "viral" and pathogen.type != "bacterial":
                raise InvalidPathogenTypeException
            if pathogen.type == "viral":
                filename = f"{pathogen_slug}_sequenzdaten.fasta"
            elif pathogen.type == "bacterial":
                filename = f"{pathogen_slug}_sequenzdaten.zip"
        case "contact":
            filename = f"{pathogen_slug}_kontaktdaten.csv"
        case _:
            raise InvalidExampleDataTypeException
    return filename
