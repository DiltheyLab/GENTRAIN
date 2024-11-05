import redis
from rq import Worker, Queue, Connection
from backend.exceptions.sequence_analysis_failed_exception import (
    SequenceAnalysisFailedException,
)

redis_conn = redis.from_url("redis://gentrain-redis:6379")


def job_exception(job, exc_type, exc_value, traceback):
    print("exception_handler", job, exc_type, exc_value, traceback)
    raise SequenceAnalysisFailedException


if __name__ == "__main__":
    with Connection(redis_conn):
        worker = Worker(
            [Queue("bacterial")],
            exception_handlers=[job_exception],
            disable_default_exception_handler=True,
        )
        worker.work()
