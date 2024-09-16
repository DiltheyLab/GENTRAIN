from abc import ABC, abstractmethod
import json
import socketio
from redis import Redis
from backend.exceptions.genomic_error_exception import GenomicErrorException

redis_connection = Redis(host="gentrain-redis", port=6379, decode_responses=True)
mgr = socketio.RedisManager("redis://gentrain-redis:6379")
sio = socketio.Server(client_manager=mgr)


class SequenceAnalysisStrategy(ABC):
    """Sequence Analysis Strategy Class."""

    def __init__(self, pathogen_name, fasta_id, sequence, socket_id):
        self.fasta_id = fasta_id
        self.sequence = sequence
        self.pathogen_name = pathogen_name
        self.socket_id = socket_id
        self.type = None
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

    def persist_result(self, response):
        gentrain_session_id = redis_connection.get(
            f"client:gentrain_session:{self.socket_id}"
        )
        redis_connection.hmset(
            f"client:results:{gentrain_session_id}:{self.type}:{self.fasta_id}",
            {
                "result": json.dumps(response),
                "fasta_id": self.fasta_id,
                "sequence_length": len(self.sequence),
            },
        )
        redis_connection.expire(
            name=f"client:results:{gentrain_session_id}:{self.type}:{self.fasta_id}",
            time=1800,
        )

    def execute(self):
        """Run strategy actions."""
        sio.emit(
            "sequence_analysis_started",
            self.fasta_id,
            room=f"{self.type}_{self.socket_id}",
        )
        genomic_errors = self.find_genomic_validation_errors()
        if genomic_errors and len(genomic_errors) > 0:
            raise GenomicErrorException
        self.create_input_and_output_files()
        result = self.run_analysis()
        response = self.get_response(result)
        self.persist_result(response)
        sio.emit(
            "sequence_analysis_response",
            {
                "result": response,
                "fasta_id": self.fasta_id,
                "sequence_length": len(self.sequence),
            },
            room=f"{self.type}_{self.socket_id}",
        )
        return result

    def enqueue_analysis(self, queue):
        queue.enqueue(self.execute, result_ttl=0)
