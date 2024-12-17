import csv
import re
from io import TextIOWrapper
from os import path
from types import NoneType
from zipfile import ZipFile

from Bio import SeqIO
from werkzeug.utils import secure_filename
from wtforms.validators import ValidationError

from backend.config import get_project_path
from backend.modules.core.helpers import slugify


def scheme_validator(form, field):
    if type(field.data) == str or type(field.data) == NoneType:
        return