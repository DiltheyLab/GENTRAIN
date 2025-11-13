---
title: Benutzerverwaltung & Rollen
sidebar_position: 2
---

# Benutzerverwaltung

Im Admin-Panel finden Sie unter dem Reiter **`User`** alle Funktionen zur Verwaltung von Administratoren und Benutzerkonten.  
Hier können Sie neue Benutzer anlegen, Rollen zuweisen, Passwörter ändern oder Benutzerkonten löschen.

---

## Benutzer anlegen

1. Öffnen Sie im Reiter **`User`** die Übersicht und klicken Sie auf **`Create new`**.
2. Füllen Sie die Pflichtfelder **`Username`**, **`Password`** und **`Role`** aus.

- Falls noch keine Rollen existieren, legen Sie diese zuerst im Reiter **`Role`** an.
- Für uneingeschränkten Zugriff kann die Rolle **`superuser`** vergeben werden.
- Für Benutzer mit eingeschränkten Rechten wählen Sie eine andere, passend konfigurierte Rolle.

3. Nach dem Speichern kann sich der neue Benutzer im System anmelden.

---

:::info Passwort-Richtlinie

Beim Anlegen eines Benutzers muss ein Passwort gesetzt werden.  
Die Passwortvalidierung prüft das Passwort anhand folgender Kriterien:

- mindestens **8 Zeichen**
- Verwendung von **Groß- und Kleinbuchstaben**
- mindestens **eine Ziffer**
- mindestens **ein Sonderzeichen**

Nach dem ersten Login sollte das Passwort vom Benutzer selbst geändert werden.  
Die Funktion **`Change Password`** befindet sich oben rechts im Admin-Panel und erscheint, wenn der Mauszeiger über den Benutzernamen bewegt wird.  
Die Admin-Validierung prüft die Passwortstärke sowie die korrekte Wiederholung der Eingabe.

:::

---

## Rollen & Superuser

Rollen steuern die Zugriffsrechte der Benutzer und können unter dem Reiter **`Role`** verwaltet werden.  
Die Rolle **`superuser`** besitzt erweiterte Berechtigungen, z. B.:

- Einsicht in System-Logs
- Verwaltung anderer Benutzer
- Verwaltung von Rollen und Rechten

---

:::info Für Entwickler

Für Entwicklungsumgebungen steht ein Seed-Skript unter  
`/backend/admin/prisma/seed.js`  
zur Verfügung, mit dem ein initialer Superuser angelegt werden kann.

Führen Sie das Skript im Verzeichnis `backend/admin` mit folgendem Befehl aus:

```bash
npm run prisma:seed
```

Passen Sie zuvor in der .env-Datei die Umgebungsvariablen an:

- `DEFAULT_ADMIN_USERNAME`

- `DEFAULT_ADMIN_PASSWORD`

Damit legen Sie den initialen Benutzernamen und das Passwort fest.

:::

## Sichtbarkeit & Datenschutz

- Passwörter werden in Listen- und Detailansichten nicht angezeigt.

- In Log-Ansichten werden Änderungen an Passwörtern maskiert dargestellt, um sensible Daten zu schützen.

## Sicherheitsempfehlungen

- Verwenden Sie starke, individuelle Passwörter und übermitteln Sie diese nur über sichere Kommunikationswege.

- Legen Sie nur so viele Superuser an, wie unbedingt erforderlich, um das Sicherheitsrisiko zu minimieren.
