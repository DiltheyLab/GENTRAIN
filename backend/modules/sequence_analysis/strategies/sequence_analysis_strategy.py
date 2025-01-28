from abc import ABC, abstractmethod
import json
import logging
from os import environ

from redis import Redis
from flask_socketio import SocketIO
from backend.modules.core.exceptions import (
    GenomicErrorException,
    SequenceAnalysisFailedException,
)

redis_connection = Redis(
    host=environ.get("REDIS_HOST"),
    port=environ.get("REDIS_PORT"),
    ssl=True,
    ssl_cert_reqs=None,
    username=environ.get("REDIS_USERNAME"),
    password=environ.get("REDIS_PASSWORD"),
    decode_responses=True,
)
sio = SocketIO(
    message_queue=f"rediss://{environ.get('REDIS_USERNAME')}:{environ.get('REDIS_PASSWORD')}@{environ.get('REDIS_HOST')}:{environ.get('REDIS_PORT')}?ssl_cert_reqs=none"
)


class SequenceAnalysisStrategy(ABC):
    """Sequence Analysis Strategy Class."""

    def __init__(self, pathogen, sequence_identifier, sequence, socket_id):
        self.sequence_identifier = sequence_identifier
        self.sequence = sequence
        self.pathogen = pathogen
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
            f"client:results:{gentrain_session_id}:{self.pathogen.id}:{self.sequence_identifier}",
            {
                "result": json.dumps(response),
                "sequence_identifier": self.sequence_identifier,
                "sequence_length": len(self.sequence),
            },
        )
        redis_connection.expire(
            name=f"client:results:{gentrain_session_id}:{self.pathogen.id}:{self.sequence_identifier}",
            time=1800,
        )

    def execute(self):
        """Run strategy actions."""
        try:
            sio.emit(
                "sequence_analysis_started",
                self.sequence_identifier,
                to=f"{self.type}_{self.socket_id}",
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
                    "status": "success",
                    "result": response,
                    "sequence_identifier": self.sequence_identifier,
                    "sequence_length": len(self.sequence),
                },
                to=f"{self.type}_{self.socket_id}",
            )
            return result
        except SequenceAnalysisFailedException as e:
            logging.exception(e)
            sio.emit(
                "sequence_analysis_response",
                {
                    "status": "error",
                    "sequence_identifier": self.sequence_identifier,
                },
                to=f"{self.type}_{self.socket_id}",
            )
        except Exception as e:
            logging.exception(e)
            sio.emit(
                "sequence_analysis_response",
                {
                    "status": "error",
                    "sequence_identifier": self.sequence_identifier,
                },
                to=f"{self.type}_{self.socket_id}",
            )

    def enqueue_analysis(self, queue):
        queue.enqueue(self.execute, result_ttl=0, job_timeout=600)
        sio.emit(
            "sequence_analysis_enqueued",
            self.sequence_identifier,
            to=f"{self.type}_{self.socket_id}",
        )
