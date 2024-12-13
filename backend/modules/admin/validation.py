import csv
import re
from io import TextIOWrapper
from zipfile import ZipFile

from werkzeug.datastructures import FileStorage


def validate_example_data_upload(file: FileStorage):
    with ZipFile(file.stream, "r") as zip:
        # printing all the contents of the zip file
        cases_csv_valid = validate_cases_csv(zip)
        sequences_fasta = zip.open("sequenzdaten.fasta")
        contacts_csv = zip.open("kontaktdaten.csv")

        print()
        print()
        # print()
        # pprint(sequences_fasta.read())
        # print()
        # pprint(contacts_fasta.read())
        print()
        print()
        return cases_csv_valid


def validate_cases_csv(zip):
    """
    Validate cases csv file. Header must contain static column names and flexible column names (4-6) must be valid text strings.
    Further all row entries are validated against column specific regex rules.
    """
    cases_csv = zip.open("falldaten.csv", "r")
    reader = csv.DictReader(TextIOWrapper(cases_csv), delimiter=";")
    column_names = reader.fieldnames
    if not {"Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"} <= set(column_names) or len(column_names) != 7:
        return False
    for flexible_column_name in column_names[4:7]:
        if not valid_text(flexible_column_name):
            return False
    for row in reader:
        if not validate_cases_csv_row(row, column_names):
            return False
    return True


def validate_cases_csv_row(row, column_names):
    case_id = row['Fall ID']
    sequence_id = row['Sequenz ID']
    registered_at = row['Registrierungsdatum']
    outbreak_name = row['Ausbruch']
    flexible_column_names = column_names[4:7]
    if not valid_case_id(case_id) or not valid_sequence_id(sequence_id) or not valid_date(
            registered_at) or not valid_text(outbreak_name) or not valid_text(
        row[flexible_column_names[0]]) or not valid_text(row[flexible_column_names[1]]) or not valid_text(
        row[flexible_column_names[2]]):
        return False
    return True


def valid_case_id(string):
    return re.compile(r"^[A-Za-z0-9-]+$").match(string)


def valid_sequence_id(string):
    return re.compile(r"^[A-Za-z0-9-]*$").match(string)


def valid_date(string):
    return re.compile(r"^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4})$").match(string)


def valid_text(string):
    return re.compile(r"^[A-Za-z0-9äöüÄÖÜß ]*$").match(string)
