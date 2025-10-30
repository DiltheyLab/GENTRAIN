---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 1
---

# Getting Started

This document explains how to set up a local development environment for GENTRAIN. The project contains three main parts:

- **frontend** — User Interface (React + Vite)
- **admin** — Admin-Panel (Typescript)
- **api** — Python-API (Flask/Gunicorn via Conda)
- **documentation** — Docusaurus documentation (Typescript/React/MDX)

Backend services (postgres, redis, api) are managed using Docker (see `docker-compose.dev.yaml`). You can run the whole stack via Docker Compose.

The frontend, documentation and admin can be run locally without Docker.

## Prerequisites

- Git
- Node.js (LTS recommended; used for frontend and admin dev scripts)
- npm
- Docker & Docker Compose (if you want to run the stack in containers)

## Repository layout (high level)

- `frontend/` — React application
- `backend/admin/` — Admin UI / Prisma tooling
- `backend/api/` — Python API and supervisor config (worker)
- `backend/redis` — Dockerfile and config for custom Redis setup
- `backend/data` — Static files lile Pathogen schemes and example data files
- `documentation` — Documentation files
- `.github` — GitHub workflows and dependabot config
- `.devcontainer` — VSCode devcontainer config to set up a consistent development environment inside the docker container for api

:::info Repository layout
In addition to the main directories mentioned above, the repository also contains other configuration files, scripts, and folders that are relevant for the operation of GENTRAIN. A more detailed overview can be found in the repository.
:::

## Quick start (full stack with Docker Compose)

This runs Redis, Postgres and the API in containers. The frontend, documentation and admin can be run locally (fast reload).

1. Copy environment variables

   Create a `.env` at the repository root. You can adapt the `.env.example` for this.

2. Start infrastructure and API

   Use the provided script which builds containers and starts the frontend dev server in a second step:

   ```bash
   ./dev.sh
   ```

   Or run Docker Compose directly:

   ```bash
   docker compose -f docker-compose.dev.yaml up --build
   ```

3. Frontend (local, recommended during development)

   In a terminal run:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend dev server uses Vite and will be available at the terminal output address (commonly `http://localhost:3000`).

4. Admin (local, recommended during development)

   In a terminal run:

   ```bash
   cd backend/admin
   npm install
   npm run dev
   ```

   The admin dev server uses tsc and nodemon concurrently and will be available at the terminal output address (commonly `http://localhost:4001`).

5. Documentation (local, recommended during development)

   In a terminal run:

   ```bash
   cd documentation
   npm install
   npm run start
   ```

   The documentation dev server uses docusaurus and will be available at the terminal output address.

## Environment variables

The docker compose file references a `.env` file at repository root. Please provide one so everything works as expected. You can find an example `.env.example` file in the repository.

## Running tests

- Frontend tests: `npm run test` (uses Vitest) in `frontend/`
- Admin: use linter via `npm run lint` in `backend/admin`

## Common tasks & tips

- Rebuild containers after dependency changes:

```bash
docker compose -f docker-compose.dev.yaml build --no-cache
```

- Stop & remove compose resources:

```bash
docker compose -f docker-compose.dev.yaml down -v
```

- If ports conflict, check that nothing else is listening on the same ports (Postgres default 5432, Redis default 6379, API 4000).

## Troubleshooting

- Permission errors on Linux when mounting volumes: ensure the UID/GID mapping and file permissions are OK for the container user.
- On Windows, prefer WSL2 for consistent Docker and shell behavior.
