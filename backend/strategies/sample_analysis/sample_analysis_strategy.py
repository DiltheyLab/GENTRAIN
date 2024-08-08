from abc import ABC, abstractmethod
import pathlib
import tempfile
from backend.exceptions.genomic_error_exception import GenomicErrorException
from backend.config import get_project_path


class SampleAnalysisStrategy(ABC):
    """Sample Analisys Strategy Class."""

    def __init__(self, pathogen_id, fasta_id, sequence):
        self.fasta_id = fasta_id
        self.sequence = sequence
        self.pathogen_id = pathogen_id
        self.input_file = None
        self.output_file = None

    @abstractmethod
    def get_response(self, result):
        """Get pydantic response model based on strategy."""

    @abstractmethod
    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""

    @abstractmethod
    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""

    def execute(self):
        """Run strategy actions."""
        genomic_errors = self.find_genomic_validation_errors()
        if genomic_errors and len(genomic_errors) > 0:
            raise GenomicErrorException
        self.create_input_and_output_files()
        return self.run_analysis()

    def create_input_and_output_files(self):
        """Create a fasta input file and a json output file for script."""
        # create directory if not existent
        temp_dir = f"{get_project_path()}/temp_data/sample_analysis/"
        pathlib.Path(temp_dir).mkdir(parents=True, exist_ok=True)

        # Create a temporary fasta file that is read by the bash script
        # and a json file in which the response will be written
        self.input_file = tempfile.NamedTemporaryFile(
            dir=temp_dir, suffix=".fa", delete=False
        ).name
        with open(file=self.input_file, mode="w", encoding="utf-8") as input_file:
            input_file.write(f">{self.fasta_id}\n{self.sequence}")
        self.output_file = self.input_file[:-2] + "json"
