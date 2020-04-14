#!/usr/bin/env bash

# https://github.com/docker/for-linux/issues/264
# doesn't work with docker-compose?
#export DOCKER_HOST_IP=$(ip route | grep docker0 | awk '{print $9}')

BROWSER=${PATH_TO_CHROME:-"/usr/bin/chromium"}

# start chrome in debug mode
$BROWSER \
--remote-debugging-port=9221 \
--window-position=0,0 --window-size=1,1 \
--disable-gpu --disable-software-rasterizer --disable-dev-shm-usage --disable-setuid-sandbox \
--timeout=30000 --no-first-run --no-sandbox --no-zygote \
--proxy-server='direct://' --proxy-bypass-list=* \
--deterministic-fetch &

# start services (in background)
docker-compose up -d