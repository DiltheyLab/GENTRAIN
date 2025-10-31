import shutil
import time
from abc import ABC, abstractmethod
from os import path, makedirs, rename, listdir, remove
from os.path import isdir
from zipfile import ZipFile

from werkzeug.utils import secure_filename

from backend.config import get_project_path


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
        with ZipFile(self.get_uploaded_zip_path(), "r") as uploaded_zip_file:
            extraction_directory_name = self.create_extraction_directory()
            self.extract_files(uploaded_zip_file)
            self.move_files_to_root_for_nested_zips(extraction_directory_name)
            self.activate_temp_scheme_directory(extraction_directory_name)
            remove(self.get_uploaded_zip_path())

    def create_extraction_directory(self):
        temp_extraction_directory_name = secure_filename(f"{self.pathogen.scheme_name}_{round(time.time() * 1000)}")
        self.extract_path = path.join(self.schemes_root, temp_extraction_directory_name)
        if not path.isdir(self.extract_path):
            makedirs(self.extract_path)
        return temp_extraction_directory_name

    def rename_scheme_directory_on_name_change(self):
        if (
            self.pathogen.scheme_name
            and self.pathogen.scheme_name != self.prior_scheme_name
            and self.scheme_exists(self.prior_scheme_name)
        ):
            rename(
                self.get_prior_scheme_name_directory(),
                self.get_scheme_name_directory(),
            )

    def remove_prior_scheme_directory(self):
        if self.scheme_exists(self.prior_scheme_name):
            shutil.rmtree(path.join(self.schemes_root, self.prior_scheme_name))

    def activate_temp_scheme_directory(self, extraction_directory_name: str):
        # remove the existing scheme directory and rename temp directory to scheme_name
        if self.scheme_exists(self.prior_scheme_name):
            shutil.rmtree(self.get_prior_scheme_name_directory())
        if self.scheme_exists(self.pathogen.scheme_name):
            shutil.rmtree(self.get_scheme_name_directory())
        shutil.move(
            path.join(
                self.schemes_root,
                extraction_directory_name,
            ),
            self.get_scheme_name_directory(),
        )

    def move_files_to_root_for_nested_zips(self, directory_name: str):
        content = listdir(self.extract_path)
        if len(content) == 1 and isdir(content[0]):
            sub_path = path.join(
                self.schemes_root,
                f"{directory_name}/{content[0]}",
            )
            elements = listdir(sub_path)
            for element in elements:
                shutil.move(path.join(sub_path, element), self.extract_path)
            shutil.rmtree(sub_path)

    def scheme_exists(self, scheme_name):
        return scheme_name and path.isdir(path.join(self.schemes_root, secure_filename(scheme_name)))

    def scheme_added(self):
        return path.isfile(
            self.get_uploaded_zip_path()
        )

    def get_prior_scheme_name_directory(self):
        return path.join(self.schemes_root, secure_filename(self.prior_scheme_name))

    def get_scheme_name_directory(self):
        return path.join(self.schemes_root, secure_filename(self.pathogen.scheme_name))

    def get_uploaded_zip_path(self):
        return path.join(
            self.schemes_root,
            secure_filename(f"{self.pathogen.scheme_name}.zip"),
        )