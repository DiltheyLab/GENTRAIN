FROM redis
RUN apk-get install stunnel
COPY stunnel-redis-server.conf /
WORKDIR /
ENV PYTHONUNBUFFERED=1
COPY ./redis.conf  /usr/local/etc/redis/redis.conf
RUN /etc/init.d/stunnel4 start
RUN chown -R redis:redis /usr/local/etc/redis
USER redis
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf"]
