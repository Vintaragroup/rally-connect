# Rally-connect Backend & Docker Architecture – Copilot Instructions

You are GitHub Copilot assisting with the **backend + infrastructure** for the Rally-connect application.

## 0. Context

- Frontend:
  - Name: `rally-connect`
  - Stack: React + TypeScript + Vite + Tailwind + Radix + Framer Motion
  - Location: `./rally-connect`
  - Currently uses **mock data** and has no real API integration yet.

- Backend:
  - Not implemented yet. We’re starting from scratch now.

- Requirements:
  - Everything runs in **Docker containers** using `docker-compose`.
  - **Avoid port conflicts** with other local Docker projects by:
    - using non-standard host ports
    - reading ports from environment variables, not hard-coding
  - Frontend and backend should communicate via an internal Docker network.
  - Environments: dev/staging/prod with separate `.env` files.

---

## 1. Backend Stack Decisions

Use the following stack:

- Language: **TypeScript**
- Runtime: **Node.js 20**
- Framework: **NestJS**
- ORM: **Prisma**
- Database: **PostgreSQL**
- API style: **REST**
- Auth: JWT-ready structure (stubbed for now)
- Persistence: PostgreSQL via Docker volume

Directory layout:

```
/backend
/rally-connect
```

---

## 2. Ports, Networks & Docker Strategy

Use environment variable–driven ports to avoid conflicts:

- Frontend host port: 4300 → container: 5173
- Backend host port: 4800 → container: 4000
- Postgres host port: 55432 → container: 5432

Environment variables:

```
# frontend
VITE_API_URL=http://localhost:4800

# backend
APP_PORT=4000

# db
DB_HOST=db
DB_PORT=5432
DB_USER=rallyos
DB_PASSWORD=rallyos_password
DB_NAME=rallyos

DATABASE_URL=postgresql://rallyos:rallyos_password@db:5432/rallyos
NODE_ENV=development
```

---

## 3. docker-compose.yml Structure

`docker-compose.yml` should define:

- rally-frontend (Vite dev server inside container)
- rally-backend (NestJS)
- db (Postgres)
- Shared network
- Database volume

Example structure:

```yaml
version: "3.9"

services:
  rally-frontend:
    build: ./rally-connect
    container_name: rally-frontend
    command: ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
    ports:
      - "${FRONTEND_PORT:-4300}:5173"
    environment:
      - VITE_API_URL=http://rally-backend:${APP_PORT:-4000}
    volumes:
      - ./rally-connect:/app
      - /app/node_modules
    networks:
      - rally-network
    depends_on:
      - rally-backend

  rally-backend:
    build: ./backend
    container_name: rally-backend
    ports:
      - "${BACKEND_PORT:-4800}:${APP_PORT:-4000}"
    env_file:
      - ./backend/.env.development
    depends_on:
      - db
    networks:
      - rally-network

  db:
    image: postgres:15-alpine
    container_name: rally-db
    ports:
      - "${DB_HOST_PORT:-55432}:5432"
    environment:
      - POSTGRES_DB=${DB_NAME:-rallyos}
      - POSTGRES_USER=${DB_USER:-rallyos}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-rallyos_password}
    volumes:
      - rally-db-data:/var/lib/postgresql/data
    networks:
      - rally-network

volumes:
  rally-db-data:

networks:
  rally-network:
    driver: bridge
```

---

## 4. Backend Setup – NestJS + Prisma

Inside `/backend`:

### NestJS Initialization

- Scaffold using Nest CLI
- Provide scripts:
  ```
  npm run start:dev
  npm run build
  npm run start:prod
  ```

### Prisma Initialization

- Add schema:
  ```
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }

  generator client {
    provider = "prisma-client-js"
  }
  ```

- Run migrations after containers are running.

### Dockerfile

- Multi-stage build
- Use Node 20-alpine
- Build NestJS + run dist/main.js
- Expose container port 4000

---

## 5. Environment Strategy

Create:

- `.env.example`
- `.env.development`
- `.env.staging`
- `.env.production`

Example `.env.example`:

```
APP_PORT=4000
DB_HOST=db
DB_PORT=5432
DB_USER=rallyos
DB_PASSWORD=rallyos_password
DB_NAME=rallyos
DATABASE_URL=postgresql://rallyos:rallyos_password@db:5432/rallyos
NODE_ENV=development
JWT_SECRET=changeme
```

---

## 6. API Integration Strategy

Frontend calls backend via `VITE_API_URL`.

Backend must expose:

- `GET /health` – returns `{ "status": "ok" }`

Later:
- `/sports`
- `/leagues`
- `/teams`
- `/matches`
- `/standings`

CORS allow:
- http://localhost:4300
- http://localhost:5173

---

## 7. Dev Workflow

- `docker-compose up` runs frontend + backend + db
- Vite HMR works because dev server binds 0.0.0.0
- Backend hot reload may be added later
- Prisma migrations run via docker exec

---

## 8. Success Criteria

1. `docker-compose up --build` starts all services cleanly.
2. Visiting http://localhost:4800/health returns `{ "status": "ok" }`.
3. Visiting http://localhost:4300 loads the Rally-connect frontend.
4. Prisma can successfully migrate and connect to db container.
