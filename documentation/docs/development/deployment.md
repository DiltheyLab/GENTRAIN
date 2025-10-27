---
title: Deployment
sidebar_position: 2
---

# Deployment

In diesem Abschnitt wird beschrieben, wie **GENTRAIN** sowohl intern als auch von externen Organisationen (z. B. Forschungsinstitute oder Gesundheitsbehörden) bereitgestellt werden kann.
Er erläutert den Bereitstellungs-Workflow, die Umgebungsvariablen, Secrets und die Automatisierung mittels **GitHub Actions**.

---

## 🏗️ 1. Überblick über den Deployment-Prozess

GENTRAIN unterstützt zwei Hauptmodi für die Bereitstellung:

| Modus           | Anwendungsfall                     | Tooling                            |
| --------------- | ---------------------------------- | ---------------------------------- |
| **Development** | Lokales Testen oder Anpassen       | `docker-compose.dev.yaml`          |
| **Production**  | Stabile Instanz für Organisationen | `docker-compose.prod.yaml` + Caddy |

Das Repository enthält Beispiele und Vorlagen zur Unterstützung der Einrichtung:

- **`.env.example`** — zeigt erforderliche und optionale Umgebungsvariablen.
- **`Caddyfile.example`** — Beispielkonfiguration für den Reverse Proxy Caddy, einschließlich TLS und Routing zur API und zum Frontend.
- **`.github/workflows/prod_deployment.yml`** — Produktionsworkflow (GitHub Actions CI/CD), der in der Hauptbereitstellung verwendet wird und an eigene Server angepasst werden kann.

---

## ⚙️ 2. Voraussetzungen

Folgende Abhängigkeiten müssen vor der Bereitstellung installiert sein:

- Docker (≥ 20.x)
- Docker Compose (plugin ≥ v2)
- Git

---

## 🧩 3. Lokale Entwicklungsumgebung

Führe GENTRAIN lokal aus. Im Abschnitt [Getting Started](./getting-started) finden Sie eine ausführliche Anleitung.

```bash
# Start Redis, Postgres, and API
docker compose -f docker-compose.dev.yaml up -d

# Start Frontend, Admin, and Docs (in separate terminals)
npm run dev
```

Alternativ können Sie das bereitgestellte Skript verwenden:

```bash
sh dev.sh
```

---

## 🚀 4. Produktionsbereitstellung

Die Produktionsbereitstellung nutzt **Caddy** als Reverse Proxy mit HTTPS-Unterstützung.
Permanente Docker-Volumes speichern Datenbanken, Uploads und gebaute statische Dateien.

### Schritt 1 — Repository klonen

```bash
git clone https://github.com/DiltheyLab/GENTRAIN.git
cd GENTRAIN
```

### Schritt 2 — Umgebungsvariablen konfigurieren

Wenn Sie keinen Workflow für das Deployment verwenden, legen Sie die Variablen, die in dem Abschnitt [Erklärung der Variablen und Secrets](#-6-erklärung-der-variablen-und-secrets) beschrieben sind, manuell an:

```bash
cp .env.example .env
```

Bearbeiten Sie die `.env` mit den richtigen Hostnamen, Secrets und Pfaden.

### Schritt 3 — Caddy konfigurieren

Verwenden Sie `Caddyfile.example` als Vorlage für die HTTPS- und Routing-Konfiguration:

- Frontend wird unter der Hauptdomaine bereitgestellt
- Für die API, die Dokumentation und das Admin-Panel werden entsprechende Subdomains definiert und geroutet.
- Automatische TLS-Zertifikate über Let’s Encrypt werden unterstützt

### Schritt 4 — Stack starten

```bash
docker compose -f docker-compose.prod.yaml up -d --build
```

---

## ⚙️ 5. Automatisierte Bereitstellung mit GitHub Actions

Das Repository enthält einen **Produktions-Workflow** unter
`.github/workflows/prod_deployment.yml`.

Dieser Workflow automatisiert:

1. Das Bauen von Frontend und Dokumentation
2. Die SSH-Verbindung zum Produktionsserver
3. Das Erzeugen der `.env`-Datei aus GitHub Variablen und Secrets
4. Das sichere Neustarten der Docker-Container
5. Slack-Benachrichtigungen bei Erfolg oder Fehler

Organisationen können denselben Workflow nutzen, indem sie:

- Das Repository forken oder privat spiegeln
- Eigene GitHub Actions Variablen und Secrets hinzufügen
- Einen Branch `prod` für Produktionsupdates definieren

---

## 🔧 6. Erklärung der Variablen und Secrets

Der Workflow generiert die `.env`-Datei dynamisch auf dem Server anhand von GitHub Variablen (`vars`) und Secrets (`secrets`).

Im Folgenden werden alle wichtigen Parameter erläutert.

### 🔹 Allgemein / Verbindung

| Name                | Typ      | Beschreibung                                                                   |
| ------------------- | -------- | ------------------------------------------------------------------------------ |
| `SSH_HOST`          | Variable | Hostname oder IP des Produktionsservers (verwendet von `appleboy/ssh-action`). |
| `SSH_USER`          | Variable | Benutzername für die SSH-Verbindung (z. B. `ubuntu`, `gentrain`).              |
| `SSH_PRIVATE_KEY`   | Secret   | Privater SSH-Schlüssel zur Authentifizierung (niemals ins Repo committen).     |
| `GENTRAIN_DIR`      | Variable | Pfad auf dem Server, in dem GENTRAIN installiert ist (z. B. `/opt/gentrain`).  |
| `PRODUCTION_BRANCH` | Variable | Git-Branch, der für die Produktion verwendet wird (z. B. `prod`).              |
| `GENTRAIN_PASSWORD` | Secret   | Sudo-Passwort auf dem Server, um Docker mit Root-Rechten neu zu starten.       |

### 🔹 Anwendung / API-Konfiguration

| Name                                 | Typ      | Beschreibung                                                   |
| ------------------------------------ | -------- | -------------------------------------------------------------- |
| `VITE_API_HOST`                      | Variable | Öffentlicher API-Endpunkt (z. B. `https://api.deinedomain.org` |
| ). Wird im Frontend-Build verwendet. |
| `APP_URL`                            | Variable | Basis-URL der Anwendung (für Weiterleitungen und Links).       |
| `APP_ENV` or `PROD_APP_ENV`          | Variable | Legt die Laufzeitumgebung fest (z. B. `production`).           |
| `API_DATA_DIRECTORY`                 | Variable | Pfad, in dem die API Dateien und Pathogen-Daten speichert.     |

### 🔹 Datenbank und Redis

| Name                | Typ      | Beschreibung                                                         |
| ------------------- | -------- | -------------------------------------------------------------------- |
| `DATABASE_DRIVER`   | Variable | Datenbanktreiber (in der Regel `postgres`).                          |
| `DATABASE_HOST`     | Variable | Hostname des PostgreSQL-Dienstes (Containername oder externer Host). |
| `DATABASE_PORT`     | Variable | Port des PostgreSQL-Dienstes (Standard: `5432`).                     |
| `DATABASE_NAME`     | Variable | Name der GENTRAIN-Datenbank.                                         |
| `DATABASE_USER`     | Variable | Benutzername für den Datenbankzugriff.                               |
| `DATABASE_PASSWORD` | Secret   | Passwort für die Datenbankauthentifizierung.                         |
| `REDIS_HOST`        | Variable | Hostname des Redis-Dienstes.                                         |
| `REDIS_PORT`        | Variable | Port des Redis-Dienstes (Standard: `6379`).                          |
| `REDIS_USERNAME`    | Variable | Optionaler Redis-Benutzername.                                       |
| `REDIS_PASSWORD`    | Secret   | Passwort für die Redis-Authentifizierung (falls aktiviert).          |

### 🔹 Admin-Panel

| Name                          | Typ      | Beschreibung                                                            |
| ----------------------------- | -------- | ----------------------------------------------------------------------- |
| `ADMIN_PANEL_PORT`            | Variable | Port, auf dem das Admin-Interface läuft (z. B. `5540`).                 |
| `ADMIN_PANEL_URL`             | Variable | Öffentliche oder interne URL für den Admin-Zugang.                      |
| `DEFAULT_ADMIN_USERNAME`      | Variable | Standard-Admin-Benutzername (bei der ersten Einrichtung).               |
| `DEFAULT_ADMIN_PASSWORD`      | Secret   | Standard-Admin-Passwort (sollte nach dem ersten Login geändert werden). |
| `ADMIN_HTBASIC_USERNAME`      | Variable | Benutzername für HTTP Basic Auth (Schutz der Admin-Route).              |
| `PROD_ADMIN_HTBASIC_PASSWORD` | Secret   | Passwort für HTTP Basic Auth (niemals öffentlich machen).               |

### 🔹Sicherheit und Sitzungen

| Name             | Typ    | Beschreibung                                    |
| ---------------- | ------ | ----------------------------------------------- |
| `SESSION_SECRET` | Secret | Wird zur Verschlüsselung von Sitzungen genutzt. |
| `COOKIE_SECRET`  | Secret | Wird zum Signieren sicherer Cookies verwendet.  |

### 🔹 Benachrichtigungen

| Name                | Typ      | Beschreibung                                                                 |
| ------------------- | -------- | ---------------------------------------------------------------------------- |
| `SLACK_WEBHOOK_URL` | Variable | Webhook-URL für Slack-Benachrichtigungen über den Status der Bereitstellung. |

---

## 🧱 7. Beispiel: Generierung der `.env` im Workflow

Während des GitHub Actions-Laufs werden die Umgebungsvariablen per SSH gesetzt:

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

So wird sichergestellt, dass die `.env`-Datei auf dem Server immer den aktuellen GitHub-Variablen entspricht.

---

## 💾 8. Persistente Volumes

Im Produktions-Compose sind benannte Docker-Volumes definiert:

| Volume                         | Beschreibung                                         |
| ------------------------------ | ---------------------------------------------------- |
| `postgres_data`                | PostgreSQL-Datenbankdaten (sollte gesichert werden). |
| `api_data`                     | Pathogen-Schemata, Beispieldatensätze                |
| `frontend_files`, `docs_files` | Gebaute Frontend- und Dokumentationsdateien.         |
| `caddy_config`, `caddy_data`   | Caddy-Konfiguration, Zertifikate und Logs.           |

Backup-Beispiel:

```bash
docker exec -t gentrain-db pg_dumpall -c -U ${DATABASE_USER} > backup.sql
cp -r ./api_data ./backup_api_data_$(date +%F)
```

---

## 🧯 9. Rollback

Falls eine Bereitstellung fehlschlägt:

```bash
docker compose -f docker-compose.prod.yaml down
git checkout <previous-tag>
docker compose -f docker-compose.prod.yaml up -d --build
```

Datenbank wiederherstellen (falls erforderlich):

```bash
psql -U $DATABASE_USER -d $DATABASE_NAME -f backup.sql
```

---

## 🧠 10. Sicherheitsrichtlinien

- Secrets in GitHub regelmäßig rotieren
- SSH-Zugriff auf vertrauenswürdige IPs beschränken
- HTTPS mit automatischer Erneuerung über Caddy verwenden
- Keine Klartext-Passwörter in `.env`-Dateien speichern
- Admin-Panel bei öffentlichem Zugriff mit Basic Auth absichern

---

## 📁 11. Wichtige Dateien im Repository

| Datei                                   | Zweck                                                             |
| --------------------------------------- | ----------------------------------------------------------------- |
| `.env.example`                          | Beispielkonfiguration für benötigte Umgebungsvariablen            |
| `Caddyfile.example`                     | Beispielkonfiguration für HTTPS-Reverse-Proxy                     |
| `docker-compose.dev.yaml`               | Entwicklungsumgebung                                              |
| `docker-compose.prod.yaml`              | Produktionsumgebung                                               |
| `.github/workflows/prod_deployment.yml` | Produktions-CI/CD-Workflow                                        |
| `.github/workflows/dev_deployment.yml`  | Entwicklungs-CI/CD-Workflow                                       |
| `init-entrypoint.sh`                    | Initialisiert Volumes und Benutzerrechte für Produktionscontainer |
