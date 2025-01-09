from os import path, makedirs
from os.path import isdir

from backend.modules.admin.strategies.example_data_processor.example_data_processor_strategy import ExampleDataProcessor


class ViralExampleDataProcessor(ExampleDataProcessor):
    """Concrete scheme processor strategy for viral scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def store_sequences_example_data(self, field):
        if not field.data:
            return
        file_data = field.data
        file_data.stream.seek(0)
        if not isdir(self.get_directory()):
            makedirs(self.get_directory())
        file_path = path.join(self.get_directory(), "sequenzdaten.fasta")
        file_data.save(file_path)