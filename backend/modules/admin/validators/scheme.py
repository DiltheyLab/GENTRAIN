from os import path
from types import NoneType
from zipfile import ZipFile

from werkzeug.utils import secure_filename
from wtforms.validators import ValidationError

from backend.config import get_project_path
from backend.modules.core.helpers import read_fasta_file_from_zip, slugify
from backend.modules.core.validation_rules import valid_sequence_id_in_fasta


def scheme_validator(form, field):
    if type(field.data) == str or type(field.data) == NoneType:
        return

    zip_in = ZipFile(field.data.stream, 'r')
    new_filename = path.join(f"{get_project_path()}/modules/sequence_analysis/schemes",
                             secure_filename(f"{slugify(form.scheme_name.data)}.zip"))
    zip_out = create_clean_example_date_zip(new_filename, zip_in)
    zip_in.close()
    field.data = zip_out

def create_clean_example_date_zip(name, zip_in):
    zip_out = ZipFile(name, 'w')
    zip_out.writestr("pathogen.json", zip_in.read("pathogen.json"))
    zip_out.writestr("reference.fasta", zip_in.read("reference.fasta"))
    zip_out.writestr("tree.json", zip_in.read("tree.json"))
    zip_out.close()
    return zip_out


def validate_zip(zip: ZipFile, pathogen_type: str):
    scheme_root = f"{get_project_path()}/modules/sequence_analysis/schemes/"
    try:
        validate_fasta_files(zip)
    except ValidationError as e:
        raise e
    except:
        raise ValidationError("Example data upload is not valid.")
    # prevent malicious inner zip files starting with "../" or other filenames manipulating the extraction destination
    for file_name in zip.namelist():
        target_path = path.abspath(path.join(scheme_root, file_name))

        if not target_path.startswith(path.abspath(scheme_root)):
            raise ValidationError(f"Filename {file_name} is invalid.")


def validate_fasta_files(zip):
    for file_name in zip.namelist():
        if ".fasta" in file_name:
            fasta_in = read_fasta_file_from_zip(file_name, zip)
            for row in fasta_in:
                if not valid_sequence_id_in_fasta(row.id) or row.id != row.description:
                    return False
    return True
