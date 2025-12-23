# ShortGate

A production-like, medium-scope backend project demonstrating clean architecture, authentication, Redis caching, rate limiting, analytics, security best practices, and Dockerized local deployment.

## Folder Structure

- src/
  - config/
    - env.js — environment config loader
    - db.js — Mongo connection helpers
    - redis.js — Redis client (optional)
  - controllers/ — request/response handlers
  - services/ — business logic
  - repositories/ — DB access layer (Mongoose models used here)
  - models/ — Mongoose schemas/models
  - middlewares/ — auth, validation, errors, rate limiting
  - routes/ — API routes for auth, URLs, and redirects
  - utils/ — logger, async handler, URL utils
  - validators/ — Joi schemas for inputs
- index.js — server entrypoint
- Dockerfile, docker-compose.yml — local production-like deployment
- tests/ — unit and integration tests (Jest + Supertest)

## Core Features

- Auth (JWT): Register and Login
- URL management (per user): Create short URL, optional custom alias, optional expiration, list own URLs
- Redirects: Read-heavy path cached in Redis, with fire-and-forget analytics
- Analytics: total click count + visit timestamps
- Security & Reliability: validation (Joi), centralized error handling, rate limiting, URL validation, constrained redirect route, logging, environment-based config, Mongo indexes

## API

- POST /api/auth/register { name?, email, password }
- POST /api/auth/login { email, password }
- POST /api/urls { url, alias?, expiresInDays? } (auth)
- GET /api/urls (auth)
- GET /api/urls/:shortId/analytics (auth)
- GET /:shortId (redirect)

Status codes: 201 for resource creation, 200 for success, 401 unauthorized, 404 not found, 409 conflicts, 410 gone for expired.

## Run Locally (Node)

1) Copy .env.example to .env, and set values as needed.
2) npm install
3) npm run dev

## Run with Docker Compose

1) docker compose up --build
2) API at http://localhost:8000

## Testing

- Unit tests for services (auth)
- Integration tests for APIs using mongodb-memory-server

Run: npm test

## System Design Notes

- Stateless Node server enables horizontal scaling. JWT stored client-side; Redis cache for redirect reads.
- Read-heavy redirects: caching reduces DB load and improves latency. Rate limit prevents abuse.
- Analytics updates are async (fire-and-forget) to keep redirect fast. Mongo indexes for shortId and TTL for expiration.

## Resume Bullets

- Implemented clean architecture (controllers/services/repositories), JWT auth, per-user URL management with analytics.
- Optimized hot redirect path using Redis caching and async analytics; added rate limiting and security hardening.
- Dockerized with MongoDB and Redis; wrote integration tests using in-memory Mongo for CI-friendly testing.
- Focused on clarity and correctness while keeping the system simple and explainable.
