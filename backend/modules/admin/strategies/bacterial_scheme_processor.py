from backend.modules.admin.strategies.scheme_processor_strategy import SchemeProcessorStrategy


class BacterialSchemeProcessor(SchemeProcessorStrategy):
    """Concrete analysis strategy for bacterial scheme processing."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def extract_files(self, zip_file):
        """Concrete method to extract viral scheme files."""
        zip_file.extract(".genes_list", path=self.extract_path)
        zip_file.extract(".schema_config", path=self.extract_path)
        zip_file.extract("loci_modes", path=self.extract_path)
        for filename in zip_file.namelist():
            # extract all gen-allele-fasta-files and short-fasta-files
            if ".fasta" in filename:
                zip_file.extract(filename, path=self.extract_path)
