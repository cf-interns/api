#!/bin/bash
set -e

SERVER="redis-server"

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
(docker rm $SERVER || :) && \
docker run  -d \
  -p 6380:6379 \
  --memory="0.5g" \
  --name $SERVER \
  redis

# wait for redis to start
echo "sleep wait [$SERVER] to start";
sleep 4;