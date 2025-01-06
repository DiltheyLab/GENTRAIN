from backend.modules.admin.strategies.scheme_processor_strategy import SchemeProcessorStrategy


class BacterialSchemeProcessor(SchemeProcessorStrategy):
    """Concrete scheme processor strategy for bacterial scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def extract_files(self, zip_file):
        """Concrete method to extract viral scheme files."""
        zip_filenames = zip_file.namelist()
        for filename in zip_filenames:
            if ".schema_config" in filename or ".genes_list" in filename or ".fasta" in filename:
                zip_file.extract(filename, path=self.extract_path)
