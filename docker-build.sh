#!/bin/bash

TAG=${1:-latest}
BASE=pooreoj/verto-meter

docker build -f Dockerfile -t ${BASE}:${TAG} .

echo -e "docker push ${BASE}:${TAG}"