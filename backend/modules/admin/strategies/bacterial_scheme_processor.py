import json
import shutil
import time
from os import path, makedirs, listdir, remove, rename
from zipfile import ZipFile

from backend.modules.admin.strategies.scheme_processor_strategy import SchemeProcessorStrategy


class BacterialSchemeProcessor(SchemeProcessorStrategy):
    """Concrete analysis strategy for bacterial scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def extract_files(self, zip_file):
        """Concrete method to extract viral scheme files."""
