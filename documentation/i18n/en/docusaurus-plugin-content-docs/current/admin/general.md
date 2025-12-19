---
title: General Information about the Admin Panel
sidebar_position: 1
---

# General Information about the Admin Panel

This document provides an overview of the **GENTRAIN Admin Panel**, a central tool for managing and monitoring the GENTRAIN software.

---

## Purpose & Overview

The Admin Panel is used for the **management of pathogens, users, roles, pathogen schemas**, and **example datasets**.  
It enables administrators to maintain core data structures and securely control system access.

- **Core Components:**
  - **User** – Manage user accounts and access rights
  - **Role** – Define and assign user roles
  - **Pathogen** – Manage supported pathogens and their associated schemas
  - **Log** – View audit trails and administrative activity logs

---

## Access & Authentication

- Access is provided through a **login with username and password**.
- An additional **Basic Authentication layer** protects the admin area on the server side.
- Each user is assigned a specific **role**.
  - The **`superuser`** role has extended privileges, including access to log data, user management, and role management.

---

## Sessions & Security

- Sessions are **stored server-side** in a PostgreSQL-based session store.
- Cookie and session parameters are configured in `backend/admin/src/admin/router.ts`:
  - `secure` cookies
  - `SameSite=strict`
  - `httpsOnly` enabled
- Environment variables **`SESSION_SECRET`** and **`COOKIE_SECRET`** must be set to ensure encrypted and secure session cookies.

---

## Components & Extensions

- The Admin Panel is built using [**AdminJS**](https://adminjs.co/) and uses [**Prisma**](https://www.prisma.io/) as its ORM to interact with the GENTRAIN PostgreSQL database.
- Additional features and extensions include:
  - **Logger Feature** – for tracking administrative actions
  - **Upload Feature** – for file management and administrative workflows

---

## Logging in the Admin Panel

The Admin Panel logs all **administrative changes**, such as:

- Modifications to users and roles
- Schema updates and upload operations
- System-level actions (creation, deletion, permission changes)

All logs are stored in a dedicated **`log` resource**.

---

### Log Access

- The **log view** is restricted to users with the **`superuser`** role.
- Access control is configured in the relevant admin resource (see `createLoggerResource`).

---

### Data Sensitivity & Sanitization

- Log entries may include changes to records, showing both previous and updated field values.
- **Sensitive fields** (e.g., passwords or confidential identifiers) are automatically **sanitized** before being displayed or stored.
- Logs exist solely for **auditability and security purposes**.
