import re
from abc import ABC, abstractmethod
from wtforms.validators import ValidationError

from backend.config import get_project_path
from backend.modules.core.helpers import get_csv_reader
from backend.modules.core.validation_rules import valid_text, valid_case_id, valid_sequence_id_in_csv, valid_date, \
    valid_sequence_id_in_fasta, valid_sequence
from backend.modules.admin.validators.fields.cases_example_data import cases_example_data_fields


class ExampleDataValidatorStrategy(ABC):
    """Scheme Processor Strategy Class."""

    example_data_root: str = f"{get_project_path()}/static/pathogen_example_data"
    extract_path = None
    fasta_extensions = [".fa", ".mpfa", ".fna", ".fsa", ".fasta"]

    @abstractmethod
    def validate_sequences_example(self, data):
        """Abstract method for sequence input validation."""


    def validate_cases_example(self, data):
        """
        Validate cases csv file. Header must contain static column names and flexible column names (4-6) must be valid text strings.
        Further all row entries are validated against column specific regex rules.
        """
        cases_csv = get_csv_reader(data.stream)
        column_names = cases_csv.fieldnames
        required_column_names = {value["name"] for key, value in cases_example_data_fields.items() if value["required"]}
        if not required_column_names <= set(column_names):
            raise ValidationError(f"Following columns are required: {','.join(required_column_names)}")
        allowed_static_columns = [value["name"] for key, value in cases_example_data_fields.items() if
                                  not value["flexible"]]
        allowed_flexible_columns = [value["name"] for key, value in cases_example_data_fields.items() if
                                    value["flexible"]]
        invalid_static_columns = [column_name for column_name in column_names if column_name not in allowed_static_columns]
        invalid_columns = [column_name for column_name in invalid_static_columns if not self.validate_flexible_column_name(column_name, allowed_flexible_columns)]
        print(invalid_columns)

        if invalid_columns:
            raise ValidationError(f"Following columns are invalid: {','.join(invalid_columns)}")
        for index, row in enumerate(cases_csv):
            self.validate_cases_csv_row(index, row, column_names)

    def validate_contacts_example(self, data):
        contacts_csv = get_csv_reader(data.stream)
        column_names = contacts_csv.fieldnames
        if not {"Fall ID 1", "Fall ID 2"} <= set(column_names):
            raise ValidationError("Contacts csv header is invalid.")
        for index, row in enumerate(contacts_csv):
            self.validate_contacts_csv_row(index, row)

    @staticmethod
    def validate_cases_csv_row(index, row, column_names):
        case_id = row['Fall ID']
        sequence_id = row['Sequenz ID']
        registered_at = row['Registrierungsdatum']
        outbreak_name = row['Ausbruch']
        if not valid_case_id(case_id) or not valid_sequence_id_in_csv(sequence_id) or not valid_date(
                registered_at) or not valid_text(outbreak_name):
            raise ValidationError(f"Case in row {index + 2} is invalid.")

    @staticmethod
    def validate_contacts_csv_row(index, row):
        case_id_1 = row['Fall ID 1']
        case_id_2 = row['Fall ID 2']
        type = row['Typ']
        context = row['Kontext']
        if not valid_case_id(case_id_1) or not valid_case_id(case_id_2) or not valid_text(type) or not valid_text(
                context):
            raise ValidationError(f"Contact in row {index + 2} is invalid.")

    @staticmethod
    def validate_fasta(sequences):
        for row in sequences:
            if not valid_sequence_id_in_fasta(row.id):
                raise ValidationError(f"Sequence Id {row.id} is invalid.")
            if not valid_sequence(str(row.seq)):
                raise ValidationError(f"Sequence {row.id} is invalid.")

    @staticmethod
    def validate_flexible_column_name(column_to_test, flexible_column_names):
        return any(re.match(f"^{flexible_column_name}:[a-zA-Z0-9-]+$", column_to_test) for flexible_column_name in flexible_column_names)