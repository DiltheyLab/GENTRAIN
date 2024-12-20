from os import path
from zipfile import ZipFile
from wtforms.validators import ValidationError

from backend.config import get_project_path
from backend.modules.core.helpers import read_fasta_file_from_zip
from backend.modules.core.validation_rules import valid_sequence_id_in_fasta


def scheme_validator(form, field):
    print(field.data)
    zip = ZipFile(field.data.stream, "r")
    #validate_zip(zip, form.type.data)
    print(field.data)


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
