# Testing

Dieses Kapitel beschreibt die Teststrategie, das Setup und die Ausführung für das GENTRAIN-Projekt. Wir verwenden mehrere Testebenen, um die Codequalität und Systemzuverlässigkeit sicherzustellen: Unit-Tests, End-to-End (E2E) Tests und eine produktionsähnliche Testumgebung.

## Teststrategie

GENTRAIN folgt einem mehrschichtigen Testansatz:

1. **Unit-Tests**: Testen einzelner Komponenten und Funktionen isoliert
2. **End-to-End (E2E) Tests**: Validierung vollständiger Benutzer-Workflows in einer produktionsähnlichen Umgebung

## Testumgebung einrichten

### Docker Compose für Tests

Wir verwenden Docker Compose und eine `Caddyfile.local`-Datei, um die Produktionsumgebung lokal zu simulieren. Dies stellt sicher, dass Tests unter realistischen Bedingungen mit allen erforderlichen Diensten ausgeführt werden.

#### Dienste

Die Testumgebung (`docker-compose.test.yaml`) erweitert die Haupt-`docker-compose.prod.yaml` mit zusätzlichen Konfigurationen für Tests:

- **e2e-tests**: Cypress Test-Runner
- **frontend-tests**: Frontend-Dienst mit Testkonfigurationen

Diese Dienste verwenden ein Testing-Profil, um sie von Produktionsdiensten zu isolieren.

#### Testumgebung starten

```bash
docker compose -f docker-compose.test.yaml build --no-cache
docker compose -f docker-compose.test.yaml --profile testing build e2e-tests frontend-tests
```

Diese Befehle bauen die notwendigen Docker-Images für die Testumgebung.

```bash
docker compose -f docker-compose.test.yaml up
```

Dieser Befehl startet alle in der `docker-compose.test.yaml` definierten Dienste, außer die Testservices (`e2e-tests`, `frontend-tests`). Nach dem Start der Dienste sind diese unter folgenden Domains erreichbar:

- API unter `http://api.localhost`
- Frontend unter `https://app.localhost`
- Admin-Panel unter `https://admin.localhost`
- Dokumentation unter `https://docs.localhost`

Weitere Details zum Routing finden sich in der `Caddyfile.local`.

#### Testumgebung stoppen

```bash
docker compose -f docker-compose.test.yaml down
```

### Umgebungskonfiguration

Die `.env.test`-Datei enthält testspezifische Konfigurationen und wird von den Testdiensten und der CI/CD-Pipeline verwendet.

## Unit-Testing

### Frontend Unit-Tests

Frontend Unit-Tests befinden sich im `frontend/`-Verzeichnis und verwenden Vitest als Testing-Framework.

#### Frontend Unit-Tests lokal ausführen

```bash
# Von ./frontend
npm run test
```

#### Frontend Unit-Tests in Docker ausführen

```bash
docker compose -f docker-compose.test.yaml --profile testing run --rm frontend-tests
```

### API Unit-Tests

API Unit-Tests befinden sich im `backend/api/`-Verzeichnis und verwenden pytest als Testing-Framework.

#### API Unit-Tests in Docker ausführen

```bash
docker exec gentrain-api sh -c "pytest"
```

## End-to-End (E2E) Testing mit Cypress

### Überblick

Cypress wird für E2E-Tests verwendet, um vollständige Benutzer-Workflows aus UI-Perspektive zu validieren. Tests laufen in einem echten Browser (Chrome) gegen eine Live-Testumgebung.

### Cypress-Setup

Die E2E-Testsuite befindet sich in `e2e-tests/cypress/` mit folgender Struktur:

```
cypress/
├── e2e/            # Test-Spezifikationen
│   └── smoke/      # Smoke-Tests für kritische Workflows
│   └── admin/      # Admin-Panel-Tests
│   └── app/        # Frontend-Tests
│   └── docs/       # Dokumentations-Tests
├── fixtures/       # Testdaten-Dateien
├── support/        # Hilfsfunktionen und Utilities
└── screenshots/    # Screenshots von Testläufen
└── videos/         # Videoaufzeichnungen von Testläufen
```

### E2E-Tests ausführen

#### Voraussetzungen

Starten Sie die Testumgebung wie im Abschnitt [Testumgebung einrichten](#testumgebung-einrichten) beschrieben.

#### Tests ausführen

**Interaktiver Modus** (für Entwicklung):

```bash
cd e2e-tests
npx cypress open
```

Dies öffnet den Cypress Test Runner, wo Sie:

- Einzelne Tests anzeigen und debuggen können
- Tests in spezifischen Browsern ausführen können
- Testvideo-Aufzeichnungen anzeigen können
- Element-Selektoren inspizieren können

**Headless-Modus**:

```bash
cd e2e-tests
npx cypress run
```

Dies führt alle Tests in einem Headless-Browser aus und generiert einen Testbericht.

**In Docker** (für CI/CD):

```bash
docker compose -f docker-compose.test.yaml --profile testing run --rm e2e-tests
```

## Automatisiertes Testen mit GitHub Actions

### CI/CD-Workflow

Die `.github/workflows/testing.yml`-Datei definiert automatisiertes Testen bei:

- **Push auf dev-Branch**: Vollständige Testsuite-Ausführung
- **Pull Requests auf dev-Branch**: Test-Validierung vor dem Merge

### Workflow-Stages

1. **Setup**: Code auschecken und Umgebung vorbereiten
2. **Docker-Images bauen**: Alle Docker-Images inklusive Testdienste bauen
3. **Dienste starten**: Testumgebung über Docker Compose starten
4. **Auf Dienste warten**: Health-Checks stellen sicher, dass alle Dienste vor dem Testen bereit sind
5. **Unit-Tests ausführen**: Frontend- und API-Unit-Tests ausführen
6. **E2E-Tests ausführen**: Cypress End-to-End-Tests ausführen
7. **Artefakte hochladen**: Testvideos und Screenshots für Debugging speichern
8. **Aufräumen**: Testumgebung herunterfahren und Container entfernen

Der Workflow beinhaltet umfassendes Error-Handling:

- Container-Logs werden bei Fehlern für Debugging erfasst
- Test-Artefakte (Videos/Screenshots) werden unabhängig von Testergebnissen in GitHub Artifacts hochgeladen
- Dienste werden immer heruntergefahren, auch wenn Tests fehlschlagen
