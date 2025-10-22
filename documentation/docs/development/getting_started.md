---
id: getting-started
title: Getting Started
sidebar_label: Getting Started
sidebar_position: 1
---

# Getting Started

In dieser Anleitung erfahren Sie, wie Sie eine lokale Entwicklungsumgebung für **GENTRAIN** einrichten.

Das Projekt besteht aus vier Hauptkomponenten:

- **frontend** — Benutzeroberfläche (React + Vite)
- **admin** — Admin-Panel und Prisma-Setup (Typescript)
- **api** — Python-API (Flask/Gunicorn über Conda)
- **documentation** — Docusaurus Dokumentation (Typescript/React/MDX)

Die Backend-Dienste wie PostgreSQL, Redis und die API werden mit Docker verwaltet (siehe `docker-compose.dev.yaml`). Sie können den gesamten Stack mit Docker Compose ausführen.

Das Frontend, die Dokumentation und das Admin-Panel können auch lokal ohne Docker gestartet werden.

---

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass die folgenden Programme installiert sind:

- **Git**
- **Node.js** (LTS-Version empfohlen; erforderlich für Frontend- und Admin-Entwicklungsskripte)
- **npm**
- **Docker & Docker Compose** (erforderlich, wenn Sie den gesamten Stack in Containern ausführen möchten)

---

## Verzeichnisstruktur (Überblick)

- `frontend/` — React-Anwendung; lokal starten mit `npm run dev`.
- `backend/admin/` — Admin-Oberfläche und Prisma-Tools (Node/TypeScript); starten mit `npm run dev`.
- `backend/api/` — Python-API und Hintergrundprozesse; enthält Dockerfile und Startskripte.
- `backend/redis/` — Dockerfile und Konfiguration für die Redis-Instanz.
- `backend/data/` — Erregerschemata und Beispieldatensätze.
- `documentation/` — Dokumentationsdateien; lokal starten mit `npm run start`.
- `docker-compose.dev.yaml` — Docker-Compose-Datei für die Entwicklungsumgebung (Redis, Redis Insight, PostgreSQL, API, Worker).
- `dev.sh` — Hilfsskript zum Erstellen und Starten der Entwicklungsumgebung und des Frontend-Servers.

:::info Verzeichnisstruktur
Neben den oben genannten Hauptverzeichnissen enthält das Repository auch weitere Konfigurationsdateien, Skripte und Ordner, die für den Betrieb von GENTRAIN relevant sind. Eine detailliertere Übersicht finden Sie im Repository.
:::

## Schnellstart (Kompletter Stack mit Docker Compose)

Dieses Setup startet Redis, PostgreSQL und die API in Containern.
Das Frontend, die Dokumentation und das Admin-Tool können anschließend lokal ausgeführt werden, um schnellere Ladezeiten zu ermöglichen.

1. Umgebungsvariablen anlegen

   Erstellen Sie eine `.env` -Datei im Hauptverzeichnis des Repositories
   mit Hilfe der `.env.example`. Sie können diese einfach kopieren und bei Bedarf anpassen.

2. Infrastruktur und API starten

   Sie können das bereitgestellte Hilfsskript verwenden, um die Container zu erstellen und den Frontend-Entwicklungsserver zu starten:

   ```bash
   ./dev.sh
   ```

   Alternativ können Sie Docker Compose direkt ausführen:

   ```bash
   docker compose -f docker-compose.dev.yaml up --build
   ```

3. Frontend (Lokale Entwicklung)

   Führen Sie die folgenden Befehle im Terminal aus:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Der Frontend-Entwicklungsserver (Vite) wird gestartet und ist anschließend unter der im Terminal angegebenen Adresse verfügbar, in der Regel unter `http://localhost:3000`.

4. Admin (Lokale Entwicklung)

   Führen Sie die folgenden Befehle im Terminal aus:

   ```bash
   cd backend/admin
   npm install
   npm run dev
   ```

   Der Admin-Entwicklungsserver verwendet TypeScript (`tsc`) und Nodemon gleichzeitig. Er ist unter der im Terminal angegebenen Adresse erreichbar, üblicherweise `http://localhost:4001`.

5. Dokumentation (Lokale Entwicklung)

   Führen Sie die folgenden Befehle im Terminal aus:

   ```bash
   cd documentation
   npm install
   npm run start
   ```

   Der Dokumentationsserver verwendet Docusaurus und ist unter der im Terminal angegebenen Adresse verfügbar.

## Umgebungsvariablen

Die Docker-Compose-Konfiguration verweist auf eine `.env`-Datei im Hauptverzeichnis des Repositories. Stellen Sie sicher, dass diese Datei vorhanden ist, damit alle Dienste korrekt ausgeführt werden können. Eine Beispieldatei `.env.example` ist im Repository enthalten.

## Tests ausführen

- **Frontend-Tests:** Im Ordner `frontend/` mit Vitest ausführen:

```bash
npm run test
```

- **Admin-Tests:** Im Ordner `backend/admin/` mit dem Linter ausführen:

```bash
npm run lint
```

## Häufige Aufgaben & Tipps

- Container nach Abhängigkeitsänderungen neu erstellen:

```bash
docker compose -f docker-compose.dev.yaml build --no-cache
```

- Container stoppen und entfernen:

```bash
docker compose -f docker-compose.dev.yaml down -v
```

- Portkonflikte beheben:

  Achten Sie darauf, dass keine anderen Dienste dieselben Ports verwenden:
  PostgreSQL (5432), Redis (6379), API (4000).

## Fehlerbehebung

- Berechtigungsprobleme unter Linux: Stellen Sie sicher, dass die UID/GID-Zuordnung und Dateiberechtigungen für den Containerbenutzer korrekt sind.

- Windows-Nutzer: Bevorzugen Sie WSL2 für eine konsistente Docker- und Shell-Umgebung.
