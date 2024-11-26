FROM redis:alpine
RUN chown redis:redis -R /usr/local/etc/redis
USER redis
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf"]
