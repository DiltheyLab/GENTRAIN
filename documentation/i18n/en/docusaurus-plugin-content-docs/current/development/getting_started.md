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
- `backend/admin/` — Admin UI
- `backend/prisma/` — Prisma tooling for api and admin
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

In this section, you will learn step by step how to run GENTRAIN locally.

1. Copy environment variables

   Create a `.env` at the repository root. You can adapt the `.env.example` for this.

   ```bash
   # From ./
   cp .env.example .env
   ```

2. Start infrastructure and API

   ```bash
   # From ./
   docker compose -f docker-compose.dev.yaml build
   ```

   and run:

   ```bash
   # From ./
   docker compose -f docker-compose.dev.yaml up
   ```

3. Database Initialisation

   Create the database tables with the `prisma` schemes,

   ```bash
   # From ./backend/prisma
   npm install
   npm run prisma:db-push
   ```

4. Admin

   Create the adminJS prisma client:

   ```bash
   # From ./backend/prisma
   npx prisma generate --generator js_client
   ```

   Run the following commands in the terminal to seed the database and start the development server:

   ```bash
   # From ./backend/admin
   npm install
   npm run prisma:seed
   npm run build
   npm run dev
   ```

   The admin dev server uses tsc and nodemon concurrently and will be available at the terminal output address (commonly `http://localhost:4001`).

   When seeding, an admin user is created whose credentials can be customized in the `.env` file. You should now be able to log in to the admin panel with `admin:secretPassword`.

5. Frontend

   In a terminal run:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   The frontend dev server uses Vite and will be available at the terminal output address (commonly `http://localhost:3000`).

6. Documentation

   In a terminal run:

   ```bash
   cd documentation
   npm install
   npm run start
   ```

   The documentation dev server uses docusaurus and will be available at the terminal output address (commonly `http://localhost:3001`).

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
