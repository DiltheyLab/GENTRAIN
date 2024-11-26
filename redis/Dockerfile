FROM redis
RUN sh ./gen-test-certs.sh
COPY ./redis.conf  /usr/local/etc/redis/redis.conf
COPY ./tests/tls/redis.crt /usr/local/etc/redis/redis.crt
COPY ./tests/tls/redis.key /usr/local/etc/redis/redis.key
COPY ./tests/tls/ca.crt /usr/local/etc/redis/ca.crt
RUN chown -R redis:redis /usr/local/etc/redis
USER redis
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf"]
