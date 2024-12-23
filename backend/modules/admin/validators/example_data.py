from os import path
from types import NoneType
from zipfile import ZipFile

from werkzeug.utils import secure_filename
from wtforms.validators import ValidationError

from backend.config import get_project_path
from backend.modules.core.helpers import slugify, read_fasta_file_from_zip, read_csv_file_from_zip
from backend.modules.core.validation_rules import valid_case_id, valid_text, valid_sequence_id_in_csv, valid_date, \
    valid_sequence, valid_sequence_id_in_fasta


def example_data_validator(form, field):
    if type(field.data) == str or type(field.data) == NoneType:
        return
    zip_in = ZipFile(field.data.stream, "r")
    validate_zip(zip_in, form)
    # create a new zip file container only files expected for example data uploads
    zip_out = create_clean_example_data_zip(f"{form.name.data}_beispieldaten", form.type.data, zip_in)
    zip_in.close()
    zip_out.close()
    field.data = zip_out


def create_clean_example_data_zip(name, type, zip_in):
    new_zip_filename = path.join(f"{get_project_path()}/static/pathogen_example_data/",
                                 secure_filename(f"{slugify(name)}.zip"))
    zip_out = ZipFile(new_zip_filename, 'w')
    zip_out.writestr("falldaten.csv", zip_in.read("falldaten.csv"))
    if type == "viral":
        zip_out = write_viral_sequences(zip_in, zip_out)
    else:
        zip_out = write_bacterial_assemblies(zip_in, zip_out)
    zip_out.writestr("kontaktdaten.csv", zip_in.read("kontaktdaten.csv"))
    return zip_out


def write_viral_sequences(zip_in, zip_out):
    cases_csv = read_csv_file_from_zip("falldaten.csv", zip_in)
    cleaned_sequences = ""
    for row in cases_csv:
        sequence_id = row["Sequenz ID"]
        if sequence_id:
            fasta_in = read_fasta_file_from_zip(f"sequenzdaten.fasta", zip_in)
            for row in fasta_in:
                if row.id == sequence_id:
                    cleaned_sequences = cleaned_sequences + f">{sequence_id}\n{str(row.seq)}\n"
    zip_out.writestr(f"sequenzdaten.fasta", cleaned_sequences)
    return zip_out


def write_bacterial_assemblies(zip_in, zip_out):
    cases_csv = read_csv_file_from_zip("falldaten.csv", zip_in)
    for row in cases_csv:
        sequence_id = row["Sequenz ID"]
        if sequence_id:
            fasta_in = read_fasta_file_from_zip(f"sequenzdaten/{sequence_id}.fasta", zip_in)
            cleaned_assembly = ""
            for index, row in enumerate(fasta_in):
                cleaned_assembly = cleaned_assembly + f">{index}\n{str(row.seq)}\n"
            zip_out.writestr(f"sequenzdaten/{sequence_id}.fasta", cleaned_assembly)
    return zip_out


def validate_zip(zip: ZipFile, pathogen_type: str):
    example_data_root = f"{get_project_path()}/static/pathogen_example_data/"

    try:
        validate_cases_csv(zip)
        validate_viral_sequences(zip) if pathogen_type == "viral" else validate_bacterial_assemblies(zip)
        validate_contacts_csv(zip)
    except ValidationError as e:
        raise e
    except:
        raise ValidationError("Example data upload is not valid.")
    # prevent malicious inner zip files starting with "../" or other filenames manipulating the extraction destination
    for file_name in zip.namelist():
        target_path = path.abspath(path.join(example_data_root, file_name))

        if not target_path.startswith(path.abspath(example_data_root)):
            raise ValidationError(f"Filename {file_name} is invalid.")


def validate_cases_csv(zip):
    """
    Validate cases csv file. Header must contain static column names and flexible column names (4-6) must be valid text strings.
    Further all row entries are validated against column specific regex rules.
    """
    cases_csv = read_csv_file_from_zip("falldaten.csv", zip)
    column_names = cases_csv.fieldnames
    if not {"Fall ID", "Sequenz ID", "Registrierungsdatum", "Ausbruch"} <= set(column_names) or len(column_names) != 7:
        raise ValidationError("Cases csv header is invalid.")
    for flexible_column_name in column_names[4:7]:
        if not valid_text(flexible_column_name):
            raise ValidationError("Cases csv contains invalid flexible column values.")
    for index, row in enumerate(cases_csv):
        validate_cases_csv_row(index, row, column_names)


def validate_contacts_csv(zip):
    contacts_csv = read_csv_file_from_zip("kontaktdaten.csv", zip)
    column_names = contacts_csv.fieldnames
    if not {"Fall ID 1", "Fall ID 2", "Typ", "Kontext"} <= set(column_names):
        raise ValidationError("Contacts csv header is invalid.")
    for index, row in enumerate(contacts_csv):
        # increment index by 2 because of the header row
        validate_contacts_csv_row(index, row)


def validate_viral_sequences(zip):
    cases_csv = read_csv_file_from_zip("falldaten.csv", zip)
    for row in cases_csv:
        sequence_id = row["Sequenz ID"]
        if sequence_id:
            fasta_in = read_fasta_file_from_zip(f"sequenzdaten.fasta", zip)
            found_in_fasta = False
            for row in fasta_in:
                if row.id == sequence_id:
                    found_in_fasta = True

                    if not valid_sequence_id_in_fasta(row.id):
                        raise ValidationError(f"Sequence Id {sequence_id} is invalid.")
                    if not valid_sequence(str(row.seq)):
                        raise ValidationError(f"Sequence {sequence_id} is invalid.")

            if not found_in_fasta:
                raise ValidationError(f"Sequence {sequence_id} was not found in fasta.")


def validate_bacterial_assemblies(zip):
    cases_csv = read_csv_file_from_zip("falldaten.csv", zip)
    for row in cases_csv:
        if row["Sequenz ID"]:
            try:
                fasta_in = read_fasta_file_from_zip(f"sequenzdaten/{row['Sequenz ID']}.fasta", zip)
            except:
                raise ValidationError(f"Assembly for {row['Sequenz ID']} was not found.")
            for row in fasta_in:
                print(row.id)
                if not valid_sequence(str(row.seq)):
                    raise ValidationError(f"Assembly for {row['Sequenz ID']} contains invalid sequences.")


def validate_cases_csv_row(index, row, column_names):
    case_id = row['Fall ID']
    sequence_id = row['Sequenz ID']
    registered_at = row['Registrierungsdatum']
    outbreak_name = row['Ausbruch']
    flexible_column_names = column_names[4:7]
    if not valid_case_id(case_id) or not valid_sequence_id_in_csv(sequence_id) or not valid_date(
            registered_at) or not valid_text(outbreak_name) or not valid_text(
        row[flexible_column_names[0]]) or not valid_text(row[flexible_column_names[1]]) or not valid_text(
        row[flexible_column_names[2]]):
        raise ValidationError(f"Case in row {index + 2} is invalid.")


def validate_contacts_csv_row(index, row):
    case_id_1 = row['Fall ID 1']
    case_id_2 = row['Fall ID 2']
    type = row['Typ']
    context = row['Kontext']
    if not valid_case_id(case_id_1) or not valid_case_id(case_id_2) or not valid_text(type) or not valid_text(context):
        raise ValidationError(f"Contact in row {index + 2} is invalid.")

