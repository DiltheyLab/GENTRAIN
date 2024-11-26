FROM redis
RUN  apt-get update \
  && apt-get install -y wget
COPY ./redis.conf  /usr/local/etc/redis/redis.conf
RUN wget https://raw.githubusercontent.com/redis/redis/cc0091f0f9fe321948c544911b3ea71837cf86e3/utils/gen-test-certs.sh
RUN ./gen-test-certs.sh
RUN mv /usr/local/etc/redis/tests/tls/redis.crt /usr/local/etc/redis/redis.crt
RUN mv /usr/local/etc/redis/tests/tls/redis.crt /usr/local/etc/redis/redis.crt
RUN mv /usr/local/etc/redis/tests/tls/redis.key /usr/local/etc/redis/redis.key
RUN mv /usr/local/etc/redis/tests/tls/ca.crt /usr/local/etc/redis/ca.crt
RUN chown -R redis:redis /usr/local/etc/redis
USER redis
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf"]
