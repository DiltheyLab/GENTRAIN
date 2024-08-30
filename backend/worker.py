import redis
from rq import Worker, Queue, Connection

listen = ["viral", "bacterial"]

conn = redis.from_url("redis://gentrain-redis:6379")

if __name__ == "__main__":
    with Connection(conn):
        worker = Worker(list(map(Queue, listen)))
        worker.work()
