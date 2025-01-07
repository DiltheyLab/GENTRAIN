import json
from zipfile import ZipFile

from wtforms.validators import ValidationError

from backend.modules.admin.strategies.scheme_validator.scheme_validator_strategy import SchemeValidatorStrategy
from backend.modules.core.validation_rules import valid_json


class ViralSchemeValidator(SchemeValidatorStrategy):
    """Concrete validator strategy for viral scheme validator."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_zip(self):
        """Concrete template method for viral zip validation."""
        self.validate_filenames()
        self.validate_fasta_files()
        self.validate_tree_json()
        self.validate_pathogen_json()

    def validate_tree_json(self):
        content = self.zip_file.read("tree.json")
        if not valid_json(content):
            raise ValidationError("tree.json is invalid")

    def validate_pathogen_json(self):
        content = self.zip_file.read("pathogen.json")
        if not valid_json(content):
            raise ValidationError("pathogen.json is invalid")

    def fill_clean_zip(self, filename):
        zip_out = ZipFile(filename, 'w')
        pathogen_json_file = self.zip_file.read("pathogen.json")
        pathogen_json = json.loads(pathogen_json_file)
        zip_out.writestr("pathogen.json",
                         pathogen_json_file)
        if "treeJson" in pathogen_json["files"]:
            zip_out.writestr(pathogen_json["files"]["treeJson"],
            self.zip_file.read(pathogen_json["files"]["treeJson"]))
        if "reference" in pathogen_json["files"]:
            zip_out.writestr(pathogen_json["files"]["reference"],
                self.zip_file.read(pathogen_json["files"]["reference"]))
        return zip_out
