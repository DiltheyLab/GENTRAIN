import re
from abc import ABC, abstractmethod
from wtforms.validators import ValidationError

from backend.config import get_project_path
from backend.modules.core.helpers import get_csv_reader
from backend.modules.core.validation_rules import valid_text, valid_case_id, valid_sequence_id_in_csv, valid_date, \
    valid_sequence_id_in_fasta, valid_sequence


class ExampleDataValidatorStrategy(ABC):
    """Scheme Processor Strategy Class."""

    example_data_root: str = f"{get_project_path()}/static/pathogen_example_data"
    extract_path = None
    fasta_extensions = [".fa", ".mpfa", ".fna", ".fsa", ".fasta"]

    @abstractmethod
    def validate_sequences_example_data_fasta(self, data):
        """Abstract method for sequence input validation."""

    def validate_example_data_csv(self, fields, data):
        """
        Validate example data csv file (cases or contacts). Header must contain static column names and flexible column names (4-6) must be valid text strings.
        Further all row entries are validated against column specific regex rules.
        """
        cases_csv = get_csv_reader(data.stream)
        column_names = cases_csv.fieldnames
        required_column_names = {key for key, value in fields.items() if value["required"]}
        if not required_column_names <= set(column_names):
            raise ValidationError(f"Following columns are required: {','.join(required_column_names)}")
        allowed_static_columns = [key for key, value in fields.items() if
                                  not value["flexible"]]
        allowed_flexible_columns = [key for key, value in fields.items() if
                                    value["flexible"]]
        invalid_static_columns = [column_name for column_name in column_names if
                                  column_name not in allowed_static_columns]
        invalid_columns = [column_name for column_name in invalid_static_columns if
                           not self.validate_flexible_column_name(column_name, allowed_flexible_columns)]

        if invalid_columns:
            raise ValidationError(f"Following columns are invalid: {','.join(invalid_columns)}")
        for index, row in enumerate(cases_csv):
            for column_name in column_names:
                self.validate_against_pattern(fields[column_name] if column_name in fields else
                                              fields[column_name.split(":")[0]], column_name, row[column_name])

    @staticmethod
    def validate_against_pattern(field, filed_name, field_value):
        if not re.compile(field['pattern']).match(field_value):
            raise ValidationError(f"'{field_value}' is not valid for column {filed_name}.")


    @staticmethod
    def validate_fasta(sequences):
        for row in sequences:
            if not valid_sequence_id_in_fasta(row.id):
                raise ValidationError(f"Sequence Id {row.id} is invalid.")
            if not valid_sequence(str(row.seq)):
                raise ValidationError(f"Sequence {row.id} is invalid.")

    @staticmethod
    def validate_flexible_column_name(column_to_test, flexible_column_names):
        return any(re.match(f"^{flexible_column_name}:[a-zA-Z0-9-]+$", column_to_test) for flexible_column_name in
                   flexible_column_names)
