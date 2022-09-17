#!/bin/bash

cd .. &
docker build . -t chrisjolly25/tagged-image-service --no-cache &
docker compose up -d