#!/bin/bash

# start dev docker container
docker-compose -f docker-compose.dev.yaml up --build --no-deps -d
cd frontend && npm run dev