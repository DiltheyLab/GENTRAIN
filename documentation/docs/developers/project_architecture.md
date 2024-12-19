# Project Architecture

You can find the Gentrain Github Repository at https://github.com/DiltheyLab/GENTRAIN.

## Database

## Containerization

The deployment includes the following docker containers.

| Container         | Description                                                                                       | Locally accessible via |
|-------------------|---------------------------------------------------------------------------------------------------|------------------------|
| **Caddy**         | Reverse proxy and web server                                                                      | -                      |
| **Redis**         | In-memory data structure store                                                                    | -                      |
| **Backend**       | Python-based backend service providing API, WebSocket Server and Admin Panel                      | http://localhost:4000  |
| **Worker**        | Background task processor                                                                         | -                      |
| **Frontend**      | Node.js-based frontend service to build the react application for production and test instances.s | -                      |
| **Redis Insight** | GUI for Redis monitoring and management                                                           | http://localhost:5540  |
| **Database**      | Server-side postgres database                                                                     | -                      |
| **PG Admin**      | Postgres database client                                                                          | http://localhost:7777  |

## Domain Driven Design
Frontend and backend project are structured in a domain (module) driven manner.