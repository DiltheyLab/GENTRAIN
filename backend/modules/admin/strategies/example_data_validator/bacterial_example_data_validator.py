from zipfile import ZipFile

from wtforms.validators import ValidationError

from backend.modules.admin.strategies.example_data_validator.example_data_validator_strategy import \
    ExampleDataValidatorStrategy
from backend.modules.core.helpers import get_fasta_reader


class BacterialExampleDataValidator(ExampleDataValidatorStrategy):
    """Concrete scheme processor strategy for viral scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_sequences_example_data_fasta(self, data):
        if data.mimetype != "application/zip":
            raise ValidationError("File does not have an approved extension: zip")
        zip = ZipFile(data, "r")
        for file_name in zip.namelist():
            if not any(
                    extension in file_name for extension in self.fasta_extensions):
                raise ValidationError("Zip may only contain fasta files")
            fasta_file = zip.open(file_name, "r")
            fasta_sequences = get_fasta_reader(fasta_file)
            self.validate_fasta(fasta_sequences)
            fasta_file.close()
