# Architecture

## Applications

- demo-app: monitored sample application
- dashboard: observability management UI
- server: ingestion and query API

## Packages

- analytics-sdk: browser telemetry SDK
- shared-types: shared TypeScript contracts

## Data flow

Demo App -> Analytics SDK -> NestJS -> PostgreSQL -> Dashboard