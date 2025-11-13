---
title: Deployment
sidebar_position: 2
---

# Deployment

This part explains how to deploy **GENTRAIN** for both internal use and external organizations (e.g. research institutes or health agencies).  
It details the deployment workflow, environment variables, secrets, and automation using **GitHub Actions**.

---

## 🏗️ 1. Deployment Overview

GENTRAIN supports two main deployment modes:

| Mode            | Use Case                               | Tooling                            |
| --------------- | -------------------------------------- | ---------------------------------- |
| **Development** | Local testing or customization         | `docker-compose.dev.yaml`          |
| **Production**  | Stable instance for organizational use | `docker-compose.prod.yaml` + Caddy |

The repository includes examples and templates to help you get started:

- **`.env.example`** — shows required and optional environment variables.
- **`Caddyfile.example`** — example reverse proxy configuration for Caddy, including TLS and routing to the API and frontend.
- **`.github/workflows/prod_deployment.yml`** — production workflow (GitHub Actions CI/CD) used by the core deployment, which can be adapted to your own server.

---

## ⚙️ 2. Prerequisites

Install the following dependencies before deploying:

- Docker (≥ 20.x)
- Docker Compose (plugin ≥ v2)
- Git

---

## 🧩 3. Local Development Setup

Run GENTRAIN locally to test or modify code. You can find a comprehensive guide in the [Getting Started](./getting-started) section.

```bash
# Start Redis, Postgres, and API
docker compose -f docker-compose.dev.yaml up -d

# Run the frontend with hot reload
npm run dev
```

Alternatively, use the helper script:

```bash
sh dev.sh
```

---

## 🚀 4. Production Deployment

Production deployment uses **Caddy** as a reverse proxy with HTTPS support.  
Persistent Docker volumes store database, uploads, and built static files.

### Step 1 — Clone the repository

```bash
git clone https://github.com/DiltheyLab/GENTRAIN.git
cd GENTRAIN
```

### Step 2 — Configure environment variables

If you are not using a deployment workflow, manually create the variables described in the [Explanation of Variables and Secrets](#-6-explanation-of-variables-and-secrets) section:

```bash
cp .env.example .env
```

Adjust your `.env` with correct hostnames, secrets, and paths.

### Step 3 — Configure Caddy

Use `Caddyfile.example` as reference to configure Caddy for HTTPS termination and routing:

- Serves frontend and documentation under `/`
- Proxies `/api/*` to the backend container
- Supports automatic TLS certificates via Let’s Encrypt

### Step 4 — Start the stack

```bash
docker compose -f docker-compose.prod.yaml up -d --build
```

---

## ⚙️ 5. Automated Deployment with GitHub Actions

The repository includes a **production deployment workflow** at  
`.github/workflows/prod_deployment.yml`.

This workflow automates:

1. Building the **frontend** and **documentation**
2. Connecting via SSH to the remote production server
3. Regenerating `.env` from GitHub variables and secrets
4. Creating a database backup (only the last 5 backups will be saved)
5. Rebuilding and restarting Docker containers safely
6. Sending Slack notifications on success or failure

:::info Database Backup

The created database backup can be used as follows:

```bash
docker exec -i gentrain-db psql -U gentrain -d test < db_dumps/<db_dump>.sql
```

You can create a manuell Backup like this:

```bash
docker exec -t gentrain-db pg_dump -d gentrain -U gentrain > db_dumps/`date +%Y-%m-%d"_"%H_%M_%S`.sql
```

:::

This means organizations can reuse the same pipeline by:

- Forking the repo or mirroring it privately
- Adding their own GitHub **Actions variables and secrets**
- Defining a `prod` branch for production updates

---

## 🔧 6. Explanation of Variables and Secrets

The workflow dynamically writes a `.env` file on the server based on GitHub **variables (`vars`)** and **secrets (`secrets`)**.

Below is an explanation of each one and its purpose.

### 🔹 General / Connection

| Name                | Type     | Description                                                                        |
| ------------------- | -------- | ---------------------------------------------------------------------------------- |
| `SSH_HOST`          | Variable | Hostname or IP of the production server (used by `appleboy/ssh-action`).           |
| `SSH_USER`          | Variable | Username for SSH connection (e.g. `ubuntu`, `gentrain`).                           |
| `SSH_PRIVATE_KEY`   | Secret   | Private key for authentication (never commit to repo).                             |
| `GENTRAIN_DIR`      | Variable | Path on the server where GENTRAIN is located (e.g. `/opt/gentrain`).               |
| `PRODUCTION_BRANCH` | Variable | The Git branch that should be deployed (e.g. `prod`).                              |
| `GENTRAIN_PASSWORD` | Secret   | Sudo password on the remote host, used for restarting Docker with elevated rights. |

### 🔹 Application / API Configuration

| Name                        | Type     | Description                                                                       |
| --------------------------- | -------- | --------------------------------------------------------------------------------- |
| `VITE_API_HOST`             | Variable | Public API endpoint (e.g. `https://api.yourdomain.org`). Used in frontend builds. |
| `APP_URL`                   | Variable | Base URL of your application (used for redirects and link generation).            |
| `APP_ENV` or `PROD_APP_ENV` | Variable | Defines runtime environment (e.g. `production`).                                  |
| `API_DATA_DIRECTORY`        | Variable | Directory path where API stores uploaded files and pathogen data.                 |

### 🔹 Database and Redis

| Name                | Type     | Description                                                       |
| ------------------- | -------- | ----------------------------------------------------------------- |
| `DATABASE_DRIVER`   | Variable | Database driver (usually `postgres`).                             |
| `DATABASE_HOST`     | Variable | Hostname of PostgreSQL service (container name or external host). |
| `DATABASE_PORT`     | Variable | Port of PostgreSQL service (default `5432`).                      |
| `DATABASE_NAME`     | Variable | Name of the GENTRAIN database.                                    |
| `DATABASE_USER`     | Variable | Username used by GENTRAIN backend.                                |
| `DATABASE_PASSWORD` | Secret   | Password for database authentication.                             |
| `REDIS_HOST`        | Variable | Hostname of Redis service.                                        |
| `REDIS_PORT`        | Variable | Redis port (default `6379`).                                      |
| `REDIS_USERNAME`    | Variable | Optional Redis username.                                          |
| `REDIS_PASSWORD`    | Secret   | Password for Redis authentication (if enabled).                   |

### 🔹 Admin Panel

| Name                          | Type     | Description                                                           |
| ----------------------------- | -------- | --------------------------------------------------------------------- |
| `ADMIN_PANEL_PORT`            | Variable | Port on which the admin interface runs (e.g. `5540`).                 |
| `ADMIN_PANEL_URL`             | Variable | Public or internal URL for admin access.                              |
| `DEFAULT_ADMIN_USERNAME`      | Variable | Default administrator username (used during first setup).             |
| `DEFAULT_ADMIN_PASSWORD`      | Secret   | Default administrator password (should be changed after first login). |
| `ADMIN_HTBASIC_USERNAME`      | Variable | Username for HTTP Basic Auth (protects admin route).                  |
| `PROD_ADMIN_HTBASIC_PASSWORD` | Secret   | Password for HTTP Basic Auth (never expose publicly).                 |

### 🔹 Security and Sessions

| Name             | Type   | Description                                     |
| ---------------- | ------ | ----------------------------------------------- |
| `SESSION_SECRET` | Secret | Used for session encryption in the backend.     |
| `COOKIE_SECRET`  | Secret | Used to sign secure cookies in the admin panel. |

### 🔹 Notifications

| Name                | Type     | Description                                                                                   |
| ------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `SLACK_WEBHOOK_URL` | Variable | Webhook URL for Slack notifications. Used in all workflow steps to report success or failure. |

---

## 🧱 7. Example of Environment Generation in the Workflow

During the GitHub Action run, the workflow executes SSH commands like this:

```yaml
- name: Generate environment variables
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ vars.SSH_HOST }}
    username: ${{ vars.SSH_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      cd ${{ vars.GENTRAIN_DIR }}
      rm -f .env
      touch .env
      echo -e "VITE_API_HOST=${{vars.VITE_API_HOST}}" >> .env
      ...
```

This ensures the `.env` file on the server always matches the latest variables from GitHub.

---

## 💾 8. Persistent Volumes

Production Compose defines named Docker volumes:

| Volume                         | Description                                   |
| ------------------------------ | --------------------------------------------- |
| `postgres_data`                | PostgreSQL database data (must be backed up). |
| `api_data`                     | Pathogen schemes, example files               |
| `frontend_files`, `docs_files` | Built frontend and docs.                      |
| `caddy_config`, `caddy_data`   | Caddy state, certificates, and logs.          |

To back up:

```bash
docker exec -t gentrain-db pg_dumpall -c -U ${DATABASE_USER} > backup.sql
cp -r ./api_data ./backup_api_data_$(date +%F)
```

---

## 🧯 9. Rollback Procedure

If a deployment fails:

```bash
docker compose -f docker-compose.prod.yaml down
git checkout <previous-tag>
docker compose -f docker-compose.prod.yaml up -d --build
```

Restore your database if required:

```bash
psql -U $DATABASE_USER -d $DATABASE_NAME -f backup.sql
```

---

## 🧠 10. Security Best Practices

- Rotate all GitHub secrets regularly
- Restrict SSH access to trusted IPs
- Use HTTPS with automatic renewal via Caddy
- Never store plaintext passwords in `.env` files
- Use Basic Auth on the admin panel if it’s exposed publicly

---

## 📁 11. Important Repository Files

| File                                    | Purpose                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| `.env.example`                          | Example configuration for required environment variables           |
| `Caddyfile.example`                     | Example configuration for HTTPS reverse proxy                      |
| `docker-compose.dev.yaml`               | Development stack                                                  |
| `docker-compose.prod.yaml`              | Production stack                                                   |
| `.github/workflows/prod_deployment.yml` | Production CI/CD workflow                                          |
| `.github/workflows/dev_deployment.yml`  | Development CI/CD workflow                                         |
| `init-entrypoint.sh`                    | Initializes volumes and user permissions for production containers |
