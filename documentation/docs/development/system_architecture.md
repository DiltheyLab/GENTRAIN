---
id: system-architecture
title: Systemarchitektur
sidebar_label: Systemarchitektur
sidebar_position: 3
---
# Systemarchitektur

## Überblick

**Gentrain** ist eine browserbasierte Webanwendung. Nachfolgend sind die wichtigsten Komponenten der Anwendungsarchitektur aufgeführt.

![System Komponenten](/img/developers/system_architecture/system_components.jpg "System Komponenten")

## Komponenten
### Frontend

#### Nutzeroberfläche

:::info Technologien
React, Zustand
:::

Da Sequenzanalysen nur auf der Serverseite durchgeführt werden, befindet sich die Mehrheit der Geschäftslogik im Frontend. Der Anwendungszustand zur Laufzeit wird mit der Zustand-Bibliothek für React verwaltet. Daten werden in einer lokalen Browser-Datenbank gespeichert, die von IndexedDB verwaltet wird.

Die React-Anwendung ist in separate Domains unterteilt. Diese Domains entsprechen den Seiten der Anwendung.

| Domain            | Beschreibung                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core              | Grundlegende Funktionen wie Anwendungsstart, Routing und Verwaltung der Browser-Datenbank.                                                                                                           |
| Dashboard         | Funktionen und Komponenten, die mit der Dashboard-Seite der Anwendung verbunden sind, einschließlich Dashboard-Graph-Canvas, zusätzlichen Informationsdiagrammen, Fallinformationen-Tabelle und Distanzmatrix. |
| Outbreak Analysis | Funktionen und Komponenten des Ausbruchsanalyse-Moduls, einschließlich Übersichtsseite der Analyse, Ausbruchsanalyse-Graph-Canvas, Einstellungsbereich und PDF-Export.                                 |
| Data Management   | Funktionen und Komponenten zur Datenverwaltung der Anwendung, einschließlich Importbereich, Tabellenübersicht der Fälle, Ausbruchsverwaltung und Konfiguration automatischer Löschungen.              |
| Help              | Funktionen und Komponenten der Hilfeseite der Anwendung.                                                                                                                                            |
| Tutorial          | Funktionen und Komponenten des Tutorial-Moduls der Anwendung.                                                                                                                                        |

Die Anwendung verwendet IndexedDB zur Verwaltung der lokalen Browser-Datenbank. Da das Tutorial auf einem statischen Datensatz basiert, wurden zwei IndexedDB-Instanzen integriert: `gentrain` und `gentrain_example`. Während letztere nur während des Tutorials aktiv ist, ist die erste während der produktiven Nutzung der Anwendung aktiv. Zusätzlich wird die State-Management-Lösung Zustand zur Datenverwaltung während der Laufzeit verwendet. Zustand orchestriert den Anwendungszustand innerhalb sogenannter Stores. In GENTRAIN spiegeln diese Stores die Domains der React-Anwendung wider, mit Ausnahme der Help-Domain, die keinen entsprechenden Store hat. Die folgende Grafik zeigt die konkreten Datenquellen der React-Anwendung.

![User Interface Data Sources](/img/developers/system_architecture/ui_data_sources.jpg "User Interface Data Sources")

#### IndexedDB

Diese Low-Level-API bietet leistungsstarke und effiziente Datenbankfunktionen für die clientseitige Speicherung. Persönliche Daten werden ausschließlich in der lokalen Browser-Datenbank gespeichert. Da IndexedDB keine automatische Datenlöschung unterstützt, bietet die Anwendung zwei Optionen: Daten können entweder nach Ablauf der 24-Stunden-TTL gelöscht werden (nur während der produktiven Nutzung oder beim erneuten Laden der Anwendung) oder beim Neuladen bzw. Schließen des Tabs/Browsers (beforeunload-Ereignis). Erstere ist standardmäßig aktiviert, es ist jedoch möglich, beide Optionen zu deaktivieren.

Beim Laden der Seite werden die Pathogene in der clientseitigen Datenbank mit den persistierten Pathogenen in der Postgres-Datenbank verglichen und synchronisiert. Das Datenmodell der clientseitigen Datenbank ist unten dargestellt.

![Entity Relationship Model (IndexedDB)](/img/developers/system_architecture/entity_relationship_indexed_db.jpg "Entity Relationship Model (IndexedDB)")

<details name="indexeddb-entities">
    <div style={{display: "flex", flexWrap: "wrap", gap: "1em", fontSize: "0.8em"}}>
        <div>
            <h4>Pathogen</h4>
                | Typ      | Name                       |
                | -------- | -------------------------- |
                | int      | id                         |
                | string   | name                       |
                | int      | genetic_distance_threshold |
                | int      | pathogen_type_id           |
                | boolean  | activated                  |
                | datetime | created_at                 |
                | datetime | updated_at                 |
            </div>
            <div>
                <h4>Pathogen Type</h4>
                | Typ      | Name           |
                | -------- | -------------- |
                | int      | id             |
                | string   | name           |
                | datetime | initialized_at |
                | datetime | created_at     |
                | datetime | updated_at     |
            </div>
            <div>
                <h4>Case</h4>
                | Typ      | Name          |
                | -------- | ------------- |
                | int      | id            |
                | string   | case_id       |
                | string   | fasta_id      |
                | datetime | registered_at |
                | string   | city          |
                | string   | zip_code      |
                | string   | street        |
                | string   | last_name     |
                | string   | first_name    |
                | datetime | created_at    |
                | datetime | updated_at    |
            </div>
            <div>
                <h4>Outbreak</h4>
                | Typ      | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | name       |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Category</h4>
                | Typ      | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | name       |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Group</h4>
                | Typ      | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | name       |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Sequence Analysis</h4>
                | Typ      | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | hash       |
                | object   | result     |
                | string   | schema     |
                | string   | version    |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Distance Matrix</h4>
                | Typ      | Name       |
                | -------- | ---------- |
                | int      | id         |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Distance</h4>
                | Typ      | Name       |
                | -------- | ---------- |
                | int      | id         |
                | int      | case_id_1  |
                | int      | case_id_2  |
                | int      | value      |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Contact</h4>
                | Typ      | Name       |
                | -------- | ---------- |
                | int      | id         |
                | int      | case_id_1  |
                | int      | case_id_2  |
                | string   | type       |
                | type     | context    |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Analysis</h4>
                | Typ      | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | name       |
                | object   | settings   |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
        </div>
</details>

### Backend 

#### API

:::info Technologien
Python (Flask), Flask-SocketIO, RQ, Prisma
:::

Diese API erleichtert die Kommunikation mit dem Backend und bietet hauptsächlich Pathogen-Ressourcen und Dateidownloads, einschließlich Beispieldaten und Pathogen-Schemata. Um sicherzustellen, dass Aufgaben zuverlässig verarbeitet werden, werden langlaufende Aufgaben in Redis-Queues verarbeitet. Ein WebSocket-Server (SocketIO) ist daher in die API integriert, um eine bidirektionale, ereignisgesteuerte Kommunikation während der Sequenzanalyse zu ermöglichen. Redis-Queues für virale und bakterielle Sequenzanalysen werden mithilfe von Supervisord orchestriert und können in der Datei `/backend/api/workers/supervisor.conf` an aktuelle Anforderungen und Serverspezifikationen angepasst werden.

![API Structure](/img/developers/system_architecture/api_structure.jpg "API Structure")

Die Python-Anwendung ist in zwei Domains unterteilt, wie in der folgenden Tabelle dargestellt.

| Domain            | Beschreibung                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pathogen Registry | Operationen im Zusammenhang mit Pathogenen. Dies umfasst das Abrufen von Informationen über persistierte Pathogene und das Herunterladen von Pathogen-Schemata und Beispieldaten. |
| Sequence Analysis | Orchestrierung der Sequenzanalyse. Dies umfasst das Verwalten von WebSocket-Ereignissen, das Ausführen von Sequenzanalyse-Jobs und das Vorbereiten von Sequenzanalyse-Antworten. |

#### Admin Panel

:::info Technologien
NodeJS + React (AdminJS), Prisma
:::

Eine Benutzeroberfläche zur Verwaltung von Pathogen-Daten, insbesondere von Schemata.

#### Redis Cache

Langlaufende Aufgaben, wie Sequenzanalysen, werden über Redis-Job-Queues verwaltet und von Workern abgearbeitet. Der Redis-Cache wird außerdem verwendet, um WebSocket-Nachrichtendaten in Chunks zu speichern, indem Sequenzabschnitte temporär abgelegt werden. Zudem werden Sequenzanalysen 30 Minuten lang gespeichert, um Datenverlust zu vermeiden, falls Benutzer das Dashboard während der Verarbeitung verlassen.

#### PostgreSQL

Pathogene, Admin-Benutzer und Rollen werden in einer serverseitigen PostgreSQL-Datenbank gespeichert, die über das Admin Panel zugänglich und verwaltbar ist.

![Entity Relationship Model (Postgres DB)](/img/developers/system_architecture/entity_relationship_postgres.jpg "Entity Relationship Model (Postgres DB)")

<details name="postgres-entities">
    <div style={{display: "flex", flexWrap: "wrap", gap: "1em", fontSize: "0.8em"}}>
        <div>
            <h4>Pathogen</h4>
            | Typ      | Name                       |
            | -------- | -------------------------- |
            | int      | id                         |
            | string   | name                       |
            | int      | genetic_distance_threshold |
            | int      | pathogen_type_id           |
            | string   | example_cases_key          |
            | string   | example_cases_size         |
            | string   | example_cases_bucket       |
            | string   | example_sequences_key      |
            | string   | example_sequences_size     |
            | string   | example_sequences_bucket   |
            | string   | example_contacts_key       |
            | string   | example_contacts_size      |
            | string   | example_contacts_bucket    |
            | datetime | created_at                 |
            | datetime | updated_at                 |
        </div>
        <div>
            <h4>User</h4>
            | Typ      | Name         |
            | -------- | ------------ |
            | int      | id           |
            | string   | username     |
            | string   | password     |
            | datetime | confirmed_at |
            | datetime | created_at   |
            | datetime | updated_at   |
            | id       | roleId       |
        </div>
        <div>
            <h4>Role</h4>
            | Typ    | Name        |
            | ------ | ----------- |
            | int    | id          |
            | string | name        |
            | string | description |
        </div>
        <div>
            <h4>Logs</h4>
            | Typ      | Name        |
            | -------- | ----------- |
            | int      | id          |
            | int      | recordId    |
            | string   | recordTitle |
            | json     | difference  |
            | string   | action      |
            | string   | resource    |
            | string   | userId      |
            | datetime | createdAt   |
            | datetime | updatedAt   |
        </div>
        <div>
            <h4>Session</h4>
            | Typ      | Name   |
            | -------- | ------ |
            | int      | sid    |
            | json     | sess   |
            | datetime | expire |
        </div>
    </div>
</details>

## Docker Deployment

GENTRAIN wird in Docker-Containern bereitgestellt. Einige Container werden verwendet, um Anwendungs-Komponenten direkt bereitzustellen, während andere zum Erstellen von Produktionscode oder für Konfigurationsaufgaben genutzt werden. Die folgende Grafik zeigt die Abhängigkeiten zwischen den Containern für eine Produktionsumgebung. Gepunktete Pfeile kennzeichnen Abhängigkeiten beim Systemstart, während durchgezogene Pfeile Abhängigkeiten zur Laufzeit darstellen.

![Docker Deployment](/img/developers/system_architecture/docker_deployment.jpg "Docker Deployment")

Nicht alle Container werden auch für die lokale Entwicklung verwendet, wie in der folgenden Tabelle dargestellt. Die Tabelle enthält auch Beschreibungen der Funktion jedes Containers.

| Container                | Zweck                                                                                                                                                                  | Lokal verwendet?   |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `gentrain-init`          | Ein einmaliger Initialisierungs-Container zur Konfiguration der Volume-Zugriffsrechte.                                                                                  |                   |
| `gentrain-frontend`      | Erstellt und liefert die kompilierten Assets der Benutzeroberfläche, die von `gentrain-caddy` bereitgestellt werden.                                                   |                   |
| `gentrain-api`           | Führt einen Flask-Server mit API-Endpunkten und WebSocket-Event-Handlern aus.                                                                                          | <center>✅</center> |
| `gentrain-worker`        | Führt Hintergrund-Jobs über die gleiche Codebasis wie `gentrain-api` in Redis-Queues aus.                                                                               | <center>✅</center> |
| `gentrain-db`            | Hält eine Postgres-Datenbank für die zentrale serverseitige Datenspeicherung (Pathogene, Benutzer, Rollen).                                                            | <center>✅</center> |
| `gentrain-redis`         | Stellt den Redis-In-Memory-Cache bereit, der von `gentrain-api` und `gentrain-worker` zur Job-Queue-Verwaltung und zur Speicherung/Abruf von Sequenzanalyse-Ergebnissen genutzt wird. | <center>✅</center> |
| `gentrain-admin`         | Führt eine AdminJS Node-Anwendung aus, um Pathogen-Informationen und Dateien zu verwalten.                                                                              |                   |
| `gentrain-documentation` | Baut die Docusaurus-Dokumentation für `gentrain-caddy` zum Bereitstellen als statische Dateien.                                                                        |                   |
| `gentrain-caddy`         | Dient als Produktions-Reverse-Proxy und statischer Dateiserver für `gentrain-api`, `gentrain-frontend` und `gentrain-documentation`.                                     |                   |
