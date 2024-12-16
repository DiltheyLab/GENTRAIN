import csv
import io
import re
from io import TextIOWrapper
from os import path
from zipfile import ZipFile, ZIP_DEFLATED

from Bio import SeqIO
from werkzeug.utils import secure_filename
from wtforms.validators import ValidationError

from backend.config import get_project_path
from backend.modules.core.helpers import slugify


def validate_example_data_upload(form, field):
    # unparsable files are handled as invalid
    file = field.data
    zip_in = ZipFile(file.stream, "r")
    if not validate_zip(zip_in):
        raise ValidationError("Example data upload is not valid.")

    # create a new zip file container only files expected for example data uploads
    zip_out = create_clean_example_date_zip(f"{form.name.data}_beispieldaten", zip_in)

    field.data = zip_out


def create_clean_example_date_zip(name, zip_in):
    new_zip_filename = path.join(f"{get_project_path()}/static/pathogen_example_data/",
                                 secure_filename(f"{slugify(name)}.zip"))
    zip_out = ZipFile(new_zip_filename, 'w')
    zip_out.writestr("falldaten.csv", zip_in.read("falldaten.csv"))
    zip_out.writestr("sequenzdaten.fasta", zip_in.read("sequenzdaten.fasta"))
    zip_out.writestr("kontaktdaten.csv", zip_in.read("kontaktdaten.csv"))
    return zip_out


def validate_zip(zip: ZipFile):
    example_data_root = f"{get_project_path()}/static/pathogen_example_data/"
    try:
        cases_csv_valid = validate_cases_csv(zip)
        sequence_fasta_valid = validate_sequences_fasta(zip)
        contacts_csv_valid = validate_contacts_csv(zip)
    except:
        raise ValidationError("Example data upload is not valid.")
    # prevent malicious inner zip files starting with "../" or other filenames manipulating the extraction destination
    for file_name in zip.namelist():
        target_path = path.abspath(path.join(example_data_root, file_name))
        if not target_path.startswith(path.abspath(example_data_root)):
            return False
    return cases_csv_valid and sequence_fasta_valid and contacts_csv_valid


def validate_cases_csv(zip):
    """
    Validate cases csv file. Header must contain static column names and flexible column names (4-6) must be valid text strings.
    Further all row entries are validated against column specific regex rules.
    """
    cases_csv = read_csv_file_from_zip("falldaten.csv", zip)
    column_names = cases_csv.fieldnames
    if not {"Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"} <= set(column_names) or len(column_names) != 7:
        return False
    for flexible_column_name in column_names[4:7]:
        if not valid_text(flexible_column_name):
            return False
    for row in cases_csv:
        if not validate_cases_csv_row(row, column_names):
            return False
    return True


def validate_contacts_csv(zip):
    """
    Validate cases csv file. Header must contain static column names and flexible column names (4-6) must be valid text strings.
    Further all row entries are validated against column specific regex rules.
    """
    contacts_csv = read_csv_file_from_zip("kontaktdaten.csv", zip)
    column_names = contacts_csv.fieldnames
    if not {"Fall ID 1", "Fall ID 2", "Typ", "Kontext"} <= set(column_names):
        return False
    for row in contacts_csv:
        if not validate_contacts_csv_row(row):
            return False
    return True


def validate_sequences_fasta(zip):
    """
    Validate cases csv file. Header must contain static column names and flexible column names (4-6) must be valid text strings.
    Further all row entries are validated against column specific regex rules.
    """
    sequences_fasta = read_fasta_file_from_zip("sequenzdaten.fasta", zip)
    for row in sequences_fasta:
        if not valid_sequence_id_in_fasta(row.id) or not valid_sequence(str(row.seq)):
            return False

    return True


def read_csv_file_from_zip(filename: str, zip: ZipFile):
    file = zip.open(filename, "r")
    reader = csv.DictReader(TextIOWrapper(file), delimiter=";")
    return reader


def read_fasta_file_from_zip(filename: str, zip: ZipFile):
    file = zip.open(filename, "r")
    reader = SeqIO.parse(TextIOWrapper(file), "fasta")
    return reader


def validate_cases_csv_row(row, column_names):
    case_id = row['Fall ID']
    sequence_id = row['Sequenz ID']
    registered_at = row['Registrierungsdatum']
    outbreak_name = row['Ausbruch']
    flexible_column_names = column_names[4:7]
    if not valid_case_id(case_id) or not valid_sequence_id_in_csv(sequence_id) or not valid_date(
            registered_at) or not valid_text(outbreak_name) or not valid_text(
        row[flexible_column_names[0]]) or not valid_text(row[flexible_column_names[1]]) or not valid_text(
        row[flexible_column_names[2]]):
        return False
    return True


def validate_contacts_csv_row(row):
    case_id_1 = row['Fall ID 1']
    case_id_2 = row['Fall ID 2']
    type = row['Typ']
    context = row['Kontext']
    if not valid_case_id(case_id_1) or not valid_case_id(case_id_2) or not valid_text(type) or not valid_text(context):
        return False
    return True


def valid_case_id(string):
    return re.compile(r"^[A-Za-z0-9-]+$").match(string)


def valid_sequence_id_in_csv(string):
    # fasta ids might be empty (*) for cases that are not sequenced
    return re.compile(r"^[A-Za-z0-9-]*$").match(string)


def valid_sequence_id_in_fasta(string):
    # fasta ids must be set
    return re.compile(r"^[A-Za-z0-9-]+$").match(string)


def valid_date(string):
    return re.compile(r"^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$").match(string)


def valid_text(string):
    return re.compile(r"^[A-Za-z0-9äöüÄÖÜß,() ]*$").match(string)


def valid_sequence(string):
    return re.compile(r"^[ATGCRYSWKMBDHVNXU\n>]+$").match(string)
