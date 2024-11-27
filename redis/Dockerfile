FROM redis:alpine
COPY ./redis.conf /usr/local/etc/redis/redis.conf
COPY ./tls /usr/local/etc/redis/tls
RUN chown redis:redis -R /usr/local/etc/redis
USER redis
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf"]
