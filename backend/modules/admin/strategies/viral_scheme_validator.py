from backend.modules.admin.strategies.scheme_validator_strategy import SchemeValidatorStrategy


class ViralSchemeValidator(SchemeValidatorStrategy):
    """Concrete validator strategy for viral scheme validator."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_zip(self):
        """Concrete template method for viral zip validation."""
        self.validate_filenames()
        self.validate_fasta_files()

    def fill_clean_zip(self, filename, zip_out):
        zip_out.writestr("pathogen.json", self.zip_file.read("pathogen.json"))
        zip_out.writestr("reference.fasta", self.zip_file.read("reference.fasta"))
        zip_out.writestr("tree.json", self.zip_file.read("tree.json"))
        return zip_out
