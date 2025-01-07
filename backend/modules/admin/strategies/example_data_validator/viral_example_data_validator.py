from wtforms.validators import ValidationError

from backend.modules.admin.strategies.example_data_validator.example_data_validator_strategy import \
    ExampleDataValidatorStrategy
from backend.modules.core.helpers import get_fasta_reader
from backend.modules.core.validation_rules import valid_sequence_id_in_fasta, valid_sequence


class ViralExampleDataValidator(ExampleDataValidatorStrategy):
    """Concrete scheme processor strategy for viral scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def validate_sequences_example(self, data):
        sequences_fasta = get_fasta_reader(data)
        for row in sequences_fasta:
            if not valid_sequence_id_in_fasta(row.id):
                raise ValidationError(f"Sequence Id {row.id} is invalid.")
            if not valid_sequence(str(row.seq)):
                raise ValidationError(f"Sequence {row.id} is invalid.")