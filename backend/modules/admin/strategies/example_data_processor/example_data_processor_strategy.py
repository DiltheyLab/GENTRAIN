import shutil
import time
from abc import ABC, abstractmethod
from os import path, makedirs, rename, listdir, remove
from os.path import isdir
from zipfile import ZipFile

from werkzeug.utils import secure_filename

from backend.config import get_project_path
from backend.modules.core.helpers import slugify


class ExampleDataProcessor(ABC):
    """Scheme Processor Strategy Class."""

    example_data_root: str = f"{get_project_path()}/static/pathogen_example_data"
    extract_path = None

    def __init__(self, pathogen, form):
        self.pathogen = pathogen
        self.form = form

    def store_example_data(self):
        self.store_cases_example_data(self.form.cases_example)
        self.store_sequences_example_data(self.form.sequences_example)
        self.store_contacts_example_data(self.form.contacts_example)

    def store_cases_example_data(self, field):
        if not field.data:
            return
        file_data = field.data
        file_data.stream.seek(0)
        if not isdir(path.join(self.example_data_root, self.pathogen.name)):
            makedirs(path.join(self.example_data_root, self.pathogen.name))
        file_path = path.join(self.example_data_root, self.pathogen.name, "falldaten.csv")
        file_data.save(file_path)

    def store_sequences_example_data(self, field):
        if not field.data:
            return
        file_data = field.data
        file_data.stream.seek(0)
        if not isdir(path.join(self.example_data_root, self.pathogen.name)):
            makedirs(path.join(self.example_data_root, self.pathogen.name))
        file_path = path.join(self.example_data_root, self.pathogen.name, "sequenzdaten.fasta")
        file_data.save(file_path)

    def store_contacts_example_data(self, field):
        if not field.data:
            return
        file_data = field.data
        file_data.stream.seek(0)
        if not isdir(path.join(self.example_data_root, self.pathogen.name)):
            makedirs(path.join(self.example_data_root, self.pathogen.name))
        file_path = path.join(self.example_data_root, self.pathogen.name, "kontaktdaten.csv")
        file_data.save(file_path)