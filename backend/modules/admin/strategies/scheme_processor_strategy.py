import shutil
import time
from abc import ABC, abstractmethod
from os import path, makedirs, rename, listdir, remove
from zipfile import ZipFile

from werkzeug.utils import secure_filename

from backend.config import get_project_path
from backend.modules.core.helpers import slugify


class SchemeProcessorStrategy(ABC):
    """Scheme Processor Strategy Class."""

    schemes_root: str = f"{get_project_path()}/modules/sequence_analysis/schemes"
    extract_path = None

    def __init__(self, pathogen, prior_scheme_name):
        self.pathogen = pathogen
        self.prior_scheme_name: str = prior_scheme_name

    @abstractmethod
    def extract_files(self, zip_file):
        """Abstract method to extract scheme files based on pathogen type."""

    def extract_scheme(self):
        """Template method to extract scheme from zip to extraction directory."""
        if not self.scheme_added():
            return
        file_path = path.join(
            self.schemes_root,
            secure_filename(f"{slugify(self.pathogen.scheme_name)}.zip"),
        )
        with ZipFile(file_path, "r") as zip_file:
            directory_name = self.create_extraction_directory()
            self.extract_files(zip_file)
            self.move_files_to_root_for_nested_zips(directory_name)
            self.activate_temp_scheme_directory(directory_name)
            # remove(file_path)

    def create_extraction_directory(self):
        directory_name = f"{self.pathogen.scheme_name}_{round(time.time() * 1000)}"
        self.extract_path = path.join(self.schemes_root, directory_name)
        if not path.isdir(self.extract_path):
            makedirs(self.extract_path)
        return directory_name

    def rename_scheme_directory_on_name_change(self):
        if (
            self.pathogen.scheme_name
            and self.pathogen.scheme_name != self.prior_scheme_name
        ):
            rename(
                path.join(self.schemes_root, self.prior_scheme_name),
                path.join(self.schemes_root, self.pathogen.scheme_name),
            )

    def remove_prior_scheme_directory(self):
        if self.scheme_exists(self.prior_scheme_name):
            shutil.rmtree(path.join(self.schemes_root, self.prior_scheme_name))

    def activate_temp_scheme_directory(self, directory_name: str):
        shutil.move(
            path.join(
                self.schemes_root,
                directory_name,
            ),
            path.join(self.schemes_root, self.pathogen.scheme_name),
        )

    def move_files_to_root_for_nested_zips(self, directory_name: str):
        content = listdir(self.extract_path)
        if len(content) == 1:
            sub_path = path.join(
                self.schemes_root,
                f"{directory_name}/{content[0]}",
            )
            elements = listdir(sub_path)
            for element in elements:
                shutil.move(path.join(sub_path, element), self.extract_path)
            shutil.rmtree(sub_path)

    def scheme_exists(self, scheme_name):
        return scheme_name and path.isdir(path.join(self.schemes_root, scheme_name))

    def scheme_added(self):
        return path.isfile(
            path.join(
                self.schemes_root,
                secure_filename(f"{slugify(self.pathogen.scheme_name)}.zip"),
            )
        )
