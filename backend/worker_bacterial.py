import redis
from rq import Worker, Queue, Connection

redis_conn = redis.from_url("redis://gentrain-redis:6379")


def exception_handler(job, exc_type, exc_value, traceback):
    print("exception_handler", job, exc_type, exc_value, traceback)


if __name__ == "__main__":
    with Connection(redis_conn):
        worker = Worker([Queue("bacterial")], exception_handlers=[exception_handler])
        worker.work()
