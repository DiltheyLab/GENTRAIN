import csv
import re
from io import TextIOWrapper, StringIO
from zipfile import ZipFile

from Bio import SeqIO
from wtforms.validators import ValidationError


def slugify(s):
    s = s.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s-]+", "-", s)
    s = re.sub(r"^-+|-+$", "", s)
    return s


def read_csv_file_from_zip(filename: str, zip: ZipFile):
    try:
        file = zip.open(filename, "r")
        reader = csv.DictReader(TextIOWrapper(file), delimiter=";")
    except:
        raise ValidationError(f"File {filename} is not readable.")
    return reader


def read_fasta_file_from_zip(filename: str, zip: ZipFile):
    try:
        file = zip.open(filename, "r")
        reader = SeqIO.parse(TextIOWrapper(file), "fasta")
    except:
        raise ValidationError(f"File {filename} is not readable.")
    return reader


def get_csv_reader(file):
    return csv.DictReader(file.read().decode("utf-8").splitlines(), delimiter=";")


def get_fasta_reader(file):
    return SeqIO.parse(StringIO(file.read().decode("utf-8")), "fasta")
