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
        print("bacterial")

    def validate_sequences_example_2(self, data):
        fasta_in = SeqIO.parse(TextIOWrapper(data), "fasta")
        found_in_fasta = False
        for row in fasta_in:
            if not valid_sequence_id_in_fasta(row.id):
                raise ValidationError(f"Sequence Id {1} is invalid.")
            if not valid_sequence(str(row.seq)):
                raise ValidationError(f"Sequence {1} is invalid.")

        if not found_in_fasta:
            raise ValidationError(f"Sequence {1} was not found in fasta.")
