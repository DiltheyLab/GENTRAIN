from abc import ABC, abstractmethod
from os import path
from zipfile import ZipFile

from werkzeug.utils import secure_filename
from wtforms.validators import ValidationError

from backend.config import get_project_path
from backend.modules.core.helpers import read_fasta_file_from_zip, slugify
from backend.modules.core.validation_rules import (
    valid_sequence_id_in_fasta,
    valid_sequence,
)


class SchemeValidatorStrategy(ABC):
    """Scheme Validator Strategy Class."""

    schemes_root: str = f"{get_project_path()}/modules/sequence_analysis/schemes"
    zip_file = None
    common_subdirectory = ""

    def __init__(self, stream, form):
        self.stream = stream
        self.form = form

    @abstractmethod
    def validate_zip(self):
        """Abstract template method for scheme validation."""

    @abstractmethod
    def fill_clean_zip(self, filename):
        """Abstract template method to add files to clean zip."""

    def validate(self):
        self.zip_file = ZipFile(self.stream, "r")
        self.get_common_subdirectory()
        self.validate_zip()
        self.zip_file.close()

    def clean_zip(self):
        self.zip_file = ZipFile(self.stream, "r")
        self.get_common_subdirectory()
        filename = path.join(
            f"{get_project_path()}/modules/sequence_analysis/schemes",
            secure_filename(f"{self.form.scheme_name.data}.zip"),
        )
        zip_out = self.fill_clean_zip(filename)
        self.zip_file.close()
        zip_out.close()
        return zip_out

    def validate_filenames(self):
        scheme_root = f"{get_project_path()}/modules/sequence_analysis/schemes/"
        try:
            self.validate_fasta_files()
        except ValidationError as e:
            raise e
        except:
            raise ValidationError("Scheme upload is not valid.")
        # prevent malicious inner zip files starting with "../" or other filenames manipulating the extraction destination
        for file_name in self.zip_file.namelist():
            target_path = path.abspath(path.join(scheme_root, file_name))

            if not target_path.startswith(path.abspath(scheme_root)):
                raise ValidationError(f"Filename {file_name} is invalid.")

    def validate_fasta_files(self):
        for file_name in self.zip_file.namelist():

            if ".fasta" in file_name:
                fasta_in = read_fasta_file_from_zip(file_name, self.zip_file)
                for row in fasta_in:
                    if not valid_sequence_id_in_fasta(row.id):
                        raise ValidationError(f"Sequence Id {row.id} is invalid.")
                    if not valid_sequence(str(row.seq)):
                        raise ValidationError(f"Sequence {row.id} is invalid.")

    def get_common_subdirectory(self):
        file_paths = [
            name
            for name in self.zip_file.namelist()
            if not name.endswith("/")
            and "__MACOSX" not in name
            and ".DS_Store" not in name
        ]
        if not file_paths:
            return
        common_prefix = path.commonprefix(file_paths)
        self.common_subdirectory = common_prefix

    def get_common_subdirectory_filename(self, name):
        return f"{self.common_subdirectory}{name}"
