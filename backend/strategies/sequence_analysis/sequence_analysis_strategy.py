from abc import ABC, abstractmethod
import socketio
from backend.exceptions.genomic_error_exception import GenomicErrorException

mgr = socketio.RedisManager("redis://gentrain-redis:6379")
sio = socketio.Server(client_manager=mgr)


class SequenceAnalysisStrategy(ABC):
    """Sequence Analysis Strategy Class."""

    def __init__(self, pathogen_name, fasta_id, sequence):
        self.fasta_id = fasta_id
        self.sequence = sequence
        self.pathogen_name = pathogen_name
        self.input = None
        self.output = None

    @abstractmethod
    def create_input_and_output_files(self):
        """Create input and output for script based on pathogen type."""

    @abstractmethod
    def get_response(self, result):
        """Get pydantic response model based on strategy."""

    @abstractmethod
    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""

    @abstractmethod
    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""

    def execute(self, room_name):
        """Run strategy actions."""
        genomic_errors = self.find_genomic_validation_errors()
        if genomic_errors and len(genomic_errors) > 0:
            raise GenomicErrorException
        self.create_input_and_output_files()
        result = self.run_analysis()
        response = self.get_response(result)
        sio.emit(
            "sequence_analysis_response",
            {
                "result": response,
                "fasta_id": self.fasta_id,
                "sequence_length": len(self.sequence),
            },
            room=room_name,
        )
        return result

    def enqueue_job(self, room_name, queue):
        queue.enqueue(self.execute, room_name)
