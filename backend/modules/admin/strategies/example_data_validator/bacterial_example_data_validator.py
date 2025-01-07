from io import TextIOWrapper

from Bio import SeqIO
from wtforms.validators import ValidationError

from backend.modules.admin.strategies.example_data_validator.example_data_validator_strategy import \
    ExampleDataValidatorStrategy
from backend.modules.core.validation_rules import valid_sequence_id_in_fasta, valid_sequence


class BacterialExampleDataValidator(ExampleDataValidatorStrategy):
    """Concrete scheme processor strategy for viral scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_sequences_example(self, data):
        if data.mimetype != "application/zip":
            raise ValidationError("File does not have an approved extension: zip")
