import re

from wtforms.validators import ValidationError

from backend.modules.admin.strategies.scheme_validator_strategy import SchemeValidatorStrategy

class BacterialSchemeValidator(SchemeValidatorStrategy):
    """Concrete validator strategy for viral scheme validator."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_zip(self):
        """Concrete template method for viral zip validation."""
        self.validate_filenames()
        self.validate_genes_list()
        #self.validate_schema_config()
        self.validate_fasta_files()

    def validate_genes_list(self):
        decoded = self.zip_file.read(".genes_list").decode('utf-8', errors='ignore')
        filename_pattern = re.compile(r'\b[\w\-.]+\.fasta\b')
        fasta_filenames = filename_pattern.findall(decoded)
        zip_filenames = self.zip_file.namelist()
        for filename in fasta_filenames:
            if filename not in zip_filenames:
                raise ValidationError(f"Gene file {filename} is missing.")

    def validate_schema_config(self):
        # WIP: how to validate this file?
        decoded = self.zip_file.read(".schema_config")


    def fill_clean_zip(self, filename, zip_out):
        zip_out.writestr(".genes_list", self.zip_file.read(".genes_list"))
        zip_out.writestr(".schema_config", self.zip_file.read(".schema_config"))
        #zip_file.extract("loci_modes", path=self.extract_path)
        for filename in self.zip_file.namelist():
            # extract all gen-allele-fasta-files and short-fasta-files
            if ".fasta" in filename:
                zip_out.writestr(filename, self.zip_file.read(filename))

        return zip_out
