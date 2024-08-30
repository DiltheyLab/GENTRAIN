import redis
import sys
from rq import Worker, Queue, Connection

redis_conn = redis.from_url("redis://gentrain-redis:6379")

if __name__ == "__main__":
    queue_name = sys.argv[1] if len(sys.argv) > 1 else "default"
    with Connection(redis_conn):
        worker = Worker([Queue(queue_name)])
        worker.work()
