#!/bin/bash

APP_NOGPIO=${1}
DEFAULT_USER=${2}
DEFAULT_EMAIL=${3}

docker run --rm \
  -p 80:80 \
  -v /etc/keys/:/etc/keys/ \
  -v ~/:/var \
  --name verto-meter \
  -e APP_NOGPIO=${APP_NOGPIO} \
  -e DEFAULT_USER=${DEFAULT_USER} \
  -e DEFAULT_EMAIL=${DEFAULT_EMAIL} \
  -e APP_DBPATH=/var/verto-meter.db \
  pooreoj/verto-meter