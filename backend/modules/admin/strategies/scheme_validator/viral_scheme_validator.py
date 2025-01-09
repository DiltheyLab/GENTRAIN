import json
from zipfile import ZipFile

from wtforms.validators import ValidationError

from backend.modules.admin.strategies.scheme_validator.scheme_validator_strategy import SchemeValidatorStrategy
from backend.modules.core.validation_rules import valid_json


class ViralSchemeValidator(SchemeValidatorStrategy):
    """Concrete validator strategy for viral scheme validator."""

    pathogen_json = None
    pathogen_json_dump = None
    tree_json = None
    reference_fasta = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_zip(self):
        """Concrete template method for viral zip validation."""
        self.get_pathogen_json()
        self.validate_pathogen_json()
        self.get_tree_json()
        self.validate_tree_json()
        self.get_reference_fasta()
        self.validate_filenames()
        self.validate_fasta_files()

    def get_pathogen_json(self):
        try:
            self.pathogen_json = self.zip_file.read("pathogen.json")
            self.pathogen_json_dump = json.loads(self.pathogen_json)
        except KeyError:
            raise ValidationError("pathogen.json is missing")

    def get_tree_json(self):
        if "treeJson" in self.pathogen_json_dump["files"]:
            self.tree_json = self.zip_file.read(self.pathogen_json_dump["files"]["treeJson"])

    def get_reference_fasta(self):
        if "reference" in self.pathogen_json_dump["files"]:
            self.reference_fasta = self.zip_file.read(self.pathogen_json_dump["files"]["reference"])
        else:
            raise ValidationError("reference.fasta is missing")

    def validate_tree_json(self):
        if not self.tree_json:
            return
        if not valid_json(self.tree_json):
            raise ValidationError("tree.json is invalid")

    def validate_pathogen_json(self):
        if not valid_json(self.pathogen_json):
            raise ValidationError("pathogen.json is invalid")

    def fill_clean_zip(self, filename):
        zip_out = ZipFile(filename, 'w')
        zip_out.writestr("pathogen.json",
                         self.pathogen_json)
        if self.tree_json:
            zip_out.writestr(self.pathogen_json_dump["files"]["treeJson"],
                             self.tree_json)
        zip_out.writestr(self.pathogen_json_dump["files"]["reference"],
                         self.reference_fasta)
        return zip_out
