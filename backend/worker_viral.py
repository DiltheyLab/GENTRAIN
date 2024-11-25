from os import environ

import redis
from rq import Worker, Queue, Connection

redis_conn = redis.from_url(f"redis://{environ.get('REDIS_USERNAME')}:{environ.get('REDIS_PASSWORD')}@{environ.get('REDIS_HOST')}:{environ.get('REDIS_PORT')}")

if __name__ == "__main__":
    with Connection(redis_conn):
        worker = Worker([Queue("viral")])
        worker.work()
