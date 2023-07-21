#!/bin/bash
set -e

SERVER="rabbitmq-server"

echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
(docker rm $SERVER || :) && \
docker run  -d \
  -p 15672:15672 \
  -p 5672:5672 \
  --name $SERVER \
  rabbitmq

# wait for pg to start
echo "sleep wait [$SERVER] to start";
sleep 4;

