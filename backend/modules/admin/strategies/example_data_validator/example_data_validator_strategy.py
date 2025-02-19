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
    def validate_sequences_example(self, data):
        """Abstract method for sequence input validation."""

    def validate_cases_example(self, data):
        """
        Validate cases csv file. Header must contain static column names and flexible column names (4-6) must be valid text strings.
        Further all row entries are validated against column specific regex rules.
        """
        cases_csv = get_csv_reader(data.stream)
        column_names = cases_csv.fieldnames
        if not {"Fall ID", "Registrierungsdatum"} <= set(column_names):
            raise ValidationError("Cases csv header is invalid.")
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
