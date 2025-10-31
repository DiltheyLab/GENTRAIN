from wtforms.validators import ValidationError

from backend.modules.admin.strategies.example_data_validator.example_data_validator_strategy import \
    ExampleDataValidatorStrategy
from backend.modules.core.helpers import get_fasta_reader


class ViralExampleDataValidator(ExampleDataValidatorStrategy):
    """Concrete scheme processor strategy for viral scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_sequences_example_data_fasta(self, data):
        if (data.mimetype != "application/octet-stream" and not any(
                extension in data.filename for extension in self.fasta_extensions)):
            raise ValidationError("File does not have an approved extension: fa, mpfa, fna, fsa or fasta")
        fasta_sequences = get_fasta_reader(data.stream)
        self.validate_fasta(fasta_sequences)
