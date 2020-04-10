#!/usr/bin/env bash

#export DEBUG=*
# https://github.com/docker/for-linux/issues/264
# doesn't work with docker-compose?
#export DOCKER_HOST_IP=$(ip route | grep docker0 | awk '{print $9}')

# start google-chrome in debug mode
/usr/bin/google-chrome \
--window-position=0,0 --window-size=1,1 \
--disable-gpu --disable-software-rasterizer --disable-dev-shm-usage --disable-setuid-sandbox \
--timeout=30000 --no-first-run --no-sandbox --no-zygote \
--proxy-server='direct://' --proxy-bypass-list=* \
--deterministic-fetch \
--remote-debugging-port=9221 &

# start services
docker-compose up