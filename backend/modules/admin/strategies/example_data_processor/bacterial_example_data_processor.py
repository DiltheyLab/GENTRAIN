from os import path, makedirs
from os.path import isdir

from backend.modules.admin.strategies.example_data_processor.example_data_processor_strategy import ExampleDataProcessor


class BacterialExampleDataProcessor(ExampleDataProcessor):
    """Concrete scheme processor strategy for bacterial example data processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def store_sequences_example_data(self, field):
        if not field.data:
            return
        file_data = field.data
        file_data.stream.seek(0)
        if not isdir(path.join(self.example_data_root, self.pathogen.name)):
            makedirs(path.join(self.example_data_root, self.pathogen.name))
        file_path = path.join(self.example_data_root, self.pathogen.name, "sequenzdaten.zip")
        file_data.save(file_path)