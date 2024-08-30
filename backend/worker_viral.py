import redis
from rq import Worker, Queue, Connection

redis_conn = redis.from_url("redis://gentrain-redis:6379")

if __name__ == "__main__":
    with Connection(redis_conn):
        worker = Worker([Queue("viral")])
        worker.work()
