#!/bin/bash

sh /backend/prisma/init.sh

# start dev docker container
docker-compose -f docker-compose.dev.yaml up --build --no-deps -d

# setup and start node applications
cd frontend && npm install && npm run dev
cd backend/admin && npm install && npm run setup