---
title: Allgemeines zum Admin-Panel
sidebar_position: 1
---

# Allgemeines zum Admin-Panel

Dieses Dokument beschreibt die grundlegenden Informationen zum **GENTRAIN Admin-Panel**, einem zentralen Werkzeug zur Verwaltung und Kontrolle der GENTRAIN-Software.

---

## Zweck & Übersicht

Das Admin-Panel dient der **Verwaltung von Pathogenen, Benutzern, Rollen, Pathogen-Schemata** sowie **Beispieldatensätzen**.  
Es ermöglicht Administratorinnen und Administratoren, zentrale Datenstrukturen zu pflegen und den Zugang zum Admin-Panel sicher zu steuern.

- **Kernkomponenten:**
  - **User** – Verwaltung von Benutzerkonten und Zugriffsrechten
  - **Role** – Definition und Zuweisung von Rollen
  - **Pathogen** – Verwaltung unterstützter Pathogene und deren Schemata
  - **Log** – Einsicht in das Protokoll (Audit Trail) administrativer Aktionen

---

## Zugang & Authentifizierung

- Der Zugang erfolgt über einen **Login mit Benutzername und Passwort**.
- Eine **zusätzliche Basic Authentication** schützt den Admin-Bereich.
- Jeder Benutzer ist einer bestimmten **Rolle** zugeordnet.
  - Die Rolle **`superuser`** besitzt erweiterte Berechtigungen, z. B. Zugriff auf Logdaten sowie Benutzer- und Rollenverwaltung.

---

## Sitzungen & Sicherheit

- Sitzungen werden **serverseitig in einer PostgreSQL-Datenbank** gespeichert (Session-Store).
- Die Cookie- und Session-Parameter sind in `backend/admin/src/admin/router.ts` konfiguriert.
  - `secure`-Cookies
  - `SameSite=strict`
  - `httpsOnly` aktiviert
- Die Umgebungsvariablen **`SESSION_SECRET`** und **`COOKIE_SECRET`** müssen gesetzt werden, um Session-Cookies sicher zu verschlüsseln.

---

## Komponenten & Erweiterungen

- Das Admin-Panel basiert auf der Bibliothek [**AdminJS**](https://adminjs.co/) und verwendet [**Prisma**](https://www.prisma.io/) als ORM, um Daten mit der GENTRAIN-PostgreSQL-Datenbank zu synchronisieren.
- Zusätzlich wurden Erweiterungen integriert, z. B.:
  - **Logger-Feature** für die Protokollierung administrativer Aktionen
  - **Upload-Feature** für Datei-Uploads innerhalb administrativer Workflows

---

## Logging im Admin-Panel

Das Admin-Panel protokolliert sämtliche **administrativen Änderungen**, z. B.:

- Änderungen an Benutzern und Rollen
- Schema-Updates und Upload-Aktivitäten
- Systemrelevante Aktionen (Erstellung, Löschung, Rechteänderungen)

Diese werden in einer dedizierten **`log`-Ressource** gespeichert.

---

### Zugriff auf Logs

- Die **Log-Ansicht** ist ausschließlich für Benutzer mit der Rolle **`superuser`** sichtbar.
- Die Zugriffskontrolle ist in der jeweiligen Admin-Ressource konfiguriert (siehe `createLoggerResource`).

---

### Datenschutz & Datenbereinigung

- Logeinträge können Änderungen an Datensätzen enthalten, inklusive alter und neuer Feldwerte.
- **Sensible Felder** (z. B. Passwörter oder vertrauliche Identifikatoren) werden vor der Anzeige oder Speicherung **automatisch entfernt**.
- Logs dienen ausschließlich der **Nachvollziehbarkeit und Sicherheit** administrativer Eingriffe.
