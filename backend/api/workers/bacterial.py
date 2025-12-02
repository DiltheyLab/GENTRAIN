from os import environ

import redis
from rq import Worker, Queue

redis_conn = redis.from_url(
    f"redis://{environ.get('REDIS_USERNAME')}:{environ.get('REDIS_PASSWORD')}@{environ.get('REDIS_HOST')}:{environ.get('REDIS_PORT')}"
)

worker = Worker([Queue("bacterial", connection=redis_conn, default_timeout=300)])
worker.work()
