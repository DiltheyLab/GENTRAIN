---
id: system-architecture
title: System Architecture
sidebar_label: System Architecture
sidebar_position: 3
---
# System Architecture

## Overview

**Gentrain** is a browser-based web application. Below are the key components of its architecture.

![System Components](/img/developers/system_architecture/system_components.jpg "System Components")

## Frontend

### Dashboard

:::info Technologies
React, Zustand
:::

Since only sequence analyses are performed on the server side, the majority of the business logic is located on the frontend. The application state at runtime is managed using the Zustand library for React. Data is persisted in a local browser database managed by IndexedDB.

The React application is divided into separate domains to create a well-structured project. These domains correspond to the application's pages.

| Domain            | Description                                                                                                                                                                                           |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Core              | Basic functionalities like application bootstrapping, routing and browser database management.                                                                                                        |
| Dashboard         | Functionalities and components associated with the dashboard page of the application inlcuding the dashboard graph canvas, additional information charts, case information table and distance matrix. |
| Outbreak Analysis | Functionalities and components associated with the outbreak analysis module inlcuding analysis overview page, outbreak analysis graph canvas and settings panel and pdf export.                       |
| Data Management   | Functionalities and components associated with the data management of the application including import section, cases overview table, outbreak management and automatic deletion configuration.       |
| Help              | Functionalities and components associated with the help page of the application.                                                                                                                      |
| Tutorial          | Functionalities and components associated with the tutorial module of the application.                                                                                                                |

The application uses IndexedDB to manage the local browser database. As the tutorial relies on a static dataset, two IndexedDB instances have been integrated: `gentrain` and `gentrain_example`. While the latter is only active during the tutorial, the former is active during productive usage of the application.

### IndexedDB

This low-level API offers powerful and efficient database functionality for client-side storage. Personal data is stored solely within the web browser's local database. As IndexedDB does not support automatic data deletion, the application provides two options: data can be deleted either after the 24-hour TTL has expired (only possible during productive usage or when the application is loaded again), or when the tab/browser is reloaded or closed (beforeunload event). The former is activated by default, but it is also possible to disable both options.

On page load, the pathogens in the client-side database are compared with the persisted pathogens in the Postgres database and synchronised. The data model of the client-side database is shown below.

![Entity Relationship Model (IndexedDB)](/img/developers/system_architecture/entity_relationship_indexed_db.jpg "Entity Relationship Model (IndexedDB)")

<details name="indexeddb-entities">
    <div style={{display: "flex", flexWrap: "wrap", gap: "1em", fontSize: "0.8em"}}>
        <div>
            <h4>Pathogen</h4>
                | Type     | Name                       |
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
                | Type     | Name           |
                | -------- | -------------- |
                | int      | id             |
                | string   | name           |
                | datetime | initialized_at |
                | datetime | created_at     |
                | datetime | updated_at     |
            </div>
            <div>
                <h4>Case</h4>
                | Type     | Name          |
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
                | Type     | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | name       |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Category</h4>
                | Type     | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | name       |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Group</h4>
                | Type     | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | name       |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Sequence Analysis</h4>
                | Type     | Name       |
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
                | Type     | Name       |
                | -------- | ---------- |
                | int      | id         |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
            <div>
                <h4>Distance</h4>
                | Type     | Name       |
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
                | Type     | Name       |
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
                | Type     | Name       |
                | -------- | ---------- |
                | int      | id         |
                | string   | name       |
                | object   | settings   |
                | datetime | created_at |
                | datetime | updated_at |
            </div>
        </div>
</details>

## Backend 

### API

:::info Technologies
Python (Flask), Flask-SocketIO, RQ, Prisma
:::

This is an API for backend communication, primarily offering pathogen resources and file downloads, such as example data and pathogen schemes. Additionally, it includes a WebSocket server to handle events during sequence analysis.

### Admin Panel

:::info Technologies
NodeJS + React (AdminJS), Prisma
:::

A user interface for managing pathogen data, particularly schemes.

### Redis Cache

Long-running tasks, such as sequence analyses, are managed via Redis job queues and handled by workers. The Redis cache is also used to implement chunking of WebSocket message data by temporarily storing sequence chunks. Furthermore, sequence analyses are persisted for 30 minutes to prevent data loss if users leave the dashboard during processing.

### PostgreSQL

Pathogens, admin users and roles are stored in a server-side PostgreSQL database, which can be accessed and managed via the Admin Panel.

![Entity Relationship Model (Postgres DB)](/img/developers/system_architecture/entity_relationship_postgres.jpg "Entity Relationship Model (Postgres DB)")

<details name="postgres-entities">
    <div style={{display: "flex", flexWrap: "wrap", gap: "1em", fontSize: "0.8em"}}>
        <div>
            <h4>Pathogen</h4>
            | Type     | Name                       |
            | -------- | -------------------------- |
            | int      | id                         |
            | string   | name                       |
            | int      | genetic_distance_threshold |
            | int      | pathogen_type_id           |
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
            | Type     | Name         |
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
            | Type   | Name        |
            | ------ | ----------- |
            | int    | id          |
            | string | name        |
            | string | description |
        </div>
        <div>
            <h4>Logs</h4>
            | Type     | Name        |
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
            | Type     | Name   |
            | -------- | ------ |
            | int      | sid    |
            | json     | sess   |
            | datetime | expire |
        </div>
    </div>
</details>