import json
import shutil
from os import path

from backend.modules.admin.strategies.scheme_processor_strategy import SchemeProcessorStrategy


class ViralSchemeProcessor(SchemeProcessorStrategy):
    """Concrete analysis strategy for viral scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def extract_files(self, zip_file):
        """Concrete method to extract viral scheme files."""
        pathogen_json = self.build_and_save_pathogen_json(zip_file)
        self.filter_necessary_files(zip_file, pathogen_json)

    def build_and_save_pathogen_json(self, zip_file):
        # only keep intended file keys in pathogen.json
        dict_filt = lambda x, y: dict([(i, x[i]) for i in x if i in set(y)])
        pathogen_json_file = zip_file.open("pathogen.json")
        pathogen_json = json.loads(pathogen_json_file.read())
        pathogen_json_file.close()
        intended_keys = ("pathogenJson", "treeJson", "reference")
        pathogen_json["files"] = dict_filt(pathogen_json["files"], intended_keys)
        pathogen_json_file = open(f"{self.extract_path}/pathogen.json", "w")
        pathogen_json_file.write(json.dumps(pathogen_json))
        pathogen_json_file.close()
        return pathogen_json

    def filter_necessary_files(self, zip_file, pathogen_json):
        # add tree.json to output directory if an entry in pathogen.json exists
        # filename might differ and is retrieved from pathogen.json
        if "treeJson" in pathogen_json["files"]:
            zip_file.extract(pathogen_json["files"]["treeJson"], path=self.extract_path)
        # add reference.fasta to output directory if an entry in pathogen.json exists
        # filename might differ and is retrieved from pathogen.json
        if "reference" in pathogen_json["files"]:
            zip_file.extract(pathogen_json["files"]["reference"], path=self.extract_path)

    def activate_temp_scheme_directory(self, directory_name: str):
        shutil.move(
            path.join(
                self.schemes_root,
                directory_name,
            ),
            path.join(self.schemes_root, self.pathogen.scheme_name),
        )
