#!/bin/bash
set -e

SERVER="maildev"


echo "echo stop & remove old docker [$SERVER] and starting new fresh instance of [$SERVER]"
(docker kill $SERVER || :) && \
(docker rm $SERVER || :) && \
docker run  -d \
  -p 1080:1080 \
  -p 1025:1025 \
  --memory="0.5g" \
  --name $SERVER \
  maildev/maildev:latest

# wait for pg to start
echo "sleep wait [$SERVER] to start";
sleep 10;