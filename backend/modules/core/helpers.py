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


def tsv_to_json(file):
    arr = []
    a = file.readline()

    # The first line consist of headings of the record
    # so we will store it in an array and move to
    # next line in input_file.
    titles = [t.strip() for t in a.split("\t")]
    for line in file:
        d = {}
        for t, f in zip(titles, line.split("\t")):
            if t == "FILE":
                continue
            # Convert each row into dictionary with keys as titles
            d[t] = f.strip()

        # we will use strip to remove '\n'.
        arr.append(d)

        # we will append all the individual dictionaires into list
        # and dump into file.
        result = arr[0]
    return result
