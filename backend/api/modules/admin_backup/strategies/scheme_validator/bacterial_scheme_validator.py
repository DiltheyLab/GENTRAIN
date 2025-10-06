import re
from os import path
from zipfile import ZipFile

from wtforms.validators import ValidationError

from backend.modules.admin.strategies.scheme_validator.scheme_validator_strategy import SchemeValidatorStrategy


class BacterialSchemeValidator(SchemeValidatorStrategy):
    """Concrete validator strategy for viral scheme validator."""

    schema_config = None
    genes_list = None
    common_subdirectory = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_zip(self):
        """Concrete template method for viral zip validation."""
        self.get_genes_list()
        self.validate_genes_list()
        self.get_schema_config()
        self.validate_fasta_files()
        self.validate_filenames()

    def get_genes_list(self):
        try:
            self.genes_list = self.zip_file.read(self.get_common_subdirectory_filename(".genes_list"))
        except KeyError:
            raise ValidationError(".genes_list is missing")

    def validate_genes_list(self):
        decoded = self.genes_list.decode('utf-8', errors='ignore')
        filename_pattern = re.compile(r'\b[\w\-.]+\.fasta\b')
        fasta_filenames = filename_pattern.findall(decoded)
        zip_filenames = self.zip_file.namelist()
        # fasta files from .genes_list must be included in the zip
        # other file content leads to a validation error
        for filename in fasta_filenames:
            if self.get_common_subdirectory_filename(filename) not in zip_filenames:
                raise ValidationError(f"Gene file {filename} is missing.")

    def get_schema_config(self):
        try:
            self.schema_config = self.zip_file.read(self.get_common_subdirectory_filename(".schema_config"))
        except KeyError:
            raise ValidationError(".schema_config is missing")

    def fill_clean_zip(self, filename):
        zip_out = ZipFile(filename, "w")
        zip_filenames = self.zip_file.namelist()
        for filename in zip_filenames:
            if ".schema_config" in filename or ".genes_list" in filename:
                zip_out.writestr(filename.replace(self.common_subdirectory, ""), self.zip_file.read(filename))
        for filename in self.zip_file.namelist():
            # extract all gen-allele-fasta-files and short-fasta-files
            if ".fasta" in filename:
                zip_out.writestr(filename.replace(self.common_subdirectory, ""), self.zip_file.read(filename))

        return zip_out
