from abc import ABC, abstractmethod
import json
import logging
from os import environ
from redis import Redis
from flask_socketio import SocketIO
from api.modules.core.exceptions import (
    GenomicErrorException,
    SequenceAnalysisFailedException,
)

redis_connection = Redis(
    host=environ.get("REDIS_HOST"),
    port=environ.get("REDIS_PORT"),
    username=environ.get("REDIS_USERNAME"),
    password=environ.get("REDIS_PASSWORD"),
    decode_responses=True,
)
sio = SocketIO(
    message_queue=f"redis://{environ.get('REDIS_USERNAME')}:{environ.get('REDIS_PASSWORD')}@{environ.get('REDIS_HOST')}:{environ.get('REDIS_PORT')}"
)


class SequenceAnalysisStrategy(ABC):
    """Sequence Analysis Strategy Class."""

    redis_connection = redis_connection
    sio = sio

    def __init__(self, pathogen, fasta_content, socket_id):
        self.fasta_content = fasta_content
        self.pathogen = pathogen
        self.socket_id = socket_id
        self.type = None
        self.input = None
        self.output = None
        self.sequences = {}

    @abstractmethod
    def create_input_and_output_files(self):
        """Create input and output for script based on pathogen type."""

    @abstractmethod
    def emit_enqueued_event(self):
        """Send enqueued event based on pathogen type. Viral strategy handles multiple sequences the bacterial strategy only send one event."""

    @abstractmethod
    def emit_started_event(self):
        """Send started event based on pathogen type. Viral strategy handles multiple sequences the bacterial strategy only send one event."""

    @abstractmethod
    def emit_failed_event(self):
        """Send failed event based on pathogen type. Viral strategy handles multiple sequences the bacterial strategy only send one event."""

    @abstractmethod
    def get_response(self, result):
        """Get pydantic response model based on strategy."""

    @abstractmethod
    def persist_and_emit_response(self, result):
        """Send analysis results to client based on pathogen type and persist in redis cache."""

    @abstractmethod
    def find_genomic_validation_errors(self):
        """Check if sequence contains genomic errors."""

    @abstractmethod
    def run_analysis(self):
        """Runs the sequence analysing script based on the pathogen."""

    def persist_result(self, fasta_hash, result_object):
        self.redis_connection.hmset(
            f"client:sequence_analysis:{fasta_hash}",
            {
                "result": json.dumps(result_object),
            },
        )
        self.redis_connection.expire(
            name=f"client:sequence_analysis:{fasta_hash}",
            time=1800,
        )

    def execute(self):
        """Run strategy actions."""
        try:
            self.emit_started_event()
            genomic_errors = self.find_genomic_validation_errors()
            if genomic_errors and len(genomic_errors) > 0:
                raise GenomicErrorException
            self.create_input_and_output_files()
            result = self.run_analysis()
            self.persist_and_emit_response(result)
            return result
        except SequenceAnalysisFailedException as e:
            logging.exception(e)
            self.emit_failed_event()
        except Exception as e:
            logging.exception(e)
            self.emit_failed_event()

    def enqueue_analysis(self, queue):
        queue.enqueue(self.execute, result_ttl=0, job_timeout=600)
        self.emit_enqueued_event()
