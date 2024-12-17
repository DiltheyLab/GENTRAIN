import json
import shutil
import time
from os import path, makedirs, listdir, remove, rename
from zipfile import ZipFile

from backend.modules.admin.strategies.scheme_processor_strategy import SchemeProcessorStrategy


class ViralSchemeProcessor(SchemeProcessorStrategy):
    """Concrete analysis strategy for bacterial sequences."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def extract_scheme(self):
        if self.scheme_added(self.pathogen.scheme_path):
            with ZipFile(
                    path.join(self.schemes_root, self.pathogen.scheme_path), "r"
            ) as zip_file:
                directory_name = self.create_extraction_directory()
                pathogen_json = self.build_and_save_pathogen_json(zip_file, )
                self.filter_necessary_files(zip_file, pathogen_json)

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
                self.remove_prior_scheme_directory()
                self.activate_temp_scheme_directory(directory_name)

            remove(path.join(self.schemes_root, self.pathogen.scheme_path))
        return

    def create_extraction_directory(self):
        directory_name = f"{self.pathogen.scheme_name}_{round(time.time() * 1000)}"
        self.extract_path = path.join(
            self.schemes_root, directory_name
        )
        if not path.isdir(self.extract_path):
            makedirs(self.extract_path)
        return directory_name

    def rename_scheme_directory_on_name_change(self):
        if self.pathogen.scheme_name and self.pathogen.scheme_name != self.prior_scheme_name:
            rename(path.join(self.schemes_root, self.prior_scheme_name),
                   path.join(self.schemes_root, self.pathogen.scheme_name))

    def build_and_save_pathogen_json(self, zip_file):
        # only keep intended file keys in pathogen.json
        dictfilt = lambda x, y: dict([(i, x[i]) for i in x if i in set(y)])
        pathogen_json = json.loads(zip_file.open("pathogen.json").read())
        intended_keys = ("pathogenJson", "treeJson", "reference")
        pathogen_json["files"] = dictfilt(pathogen_json["files"], intended_keys)
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

    def scheme_exists(self, scheme_name):
        return scheme_name and path.isdir(
            path.join(self.schemes_root, scheme_name))

    def scheme_added(self, scheme_path):
        return path.isfile(path.join(self.schemes_root, scheme_path))
