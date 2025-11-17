# System Architecture

## Overview

**Gentrain** is a browser-based web application. Below are the key components of its architecture.

![System Architecture](/img/developers/system_architecture/system_architecture.png "System Architecture")

### Dashboard

:::info Technologies
React, Zustand
:::

The majority of the business logic is located on the frontend, since only sequence analyses are performed on the server side. The application state at runtime is also managed using the Zustand library for React.

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

### IndexedDB

This is a low-level API for client-side storage, providing powerful and efficient database functionalities. Personal data is solely persisted within the web browser's local database.

### PostgreSQL

Both pathogens and admin users and roles are stored in a server-side PostgreSQL database, which can be accessed and managed via the Admin Panel.
