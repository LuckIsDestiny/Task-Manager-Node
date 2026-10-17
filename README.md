# Task Manager

A small full-stack app for practice: users register, log in, and manage their own tasks. Admins can see and delete everyone's tasks.

## Tech Stack

- **Client:** React, Vite, TypeScript
- **Server:** Node.js, Express 5, TypeScript
- **Database:** PostgreSQL on Neon, accessed with Prisma 7
- **Auth:** JWT with role-based access (`USER`, `ADMIN`)
- **Validation:** Zod
- **Package manager:** pnpm

## Project Structure

```
my-app/
  client/                 # React app
  server/
    prisma/schema.prisma  # database models
    src/
      modules/
        auth/             # register, login
        tasks/            # task CRUD
      middlewares/        # auth, authorize, validate, errorHandler
      utils/              # AppError, catchAsync
      lib/prisma.ts       # Prisma client
      app.ts
      server.ts
```

Each module has its own `routes`, `controller`, `service` and `validation` files.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- A Neon database (copy the connection string from the Neon dashboard)

### 1. Server

```bash
cd server
pnpm install
cp .env.example .env     # then fill in the values
pnpm prisma generate
pnpm prisma migrate dev --name init
pnpm dev
```

The server runs at `http://localhost:5000`.

### 2. Client

```bash
cd client
pnpm install
pnpm dev
```

The client runs at `http://localhost:5173`.

## Environment Variables

**server/.env**

```
# Pooled (host contains -pooler), used by the app
DATABASE_URL=

# Direct (no -pooler), used by the Prisma CLI
DIRECT_URL=

JWT_SECRET=
JWT_EXPIRES_IN=7d

PORT=5000

CLIENT_URL=http://localhost:5173
```

**client/.env**

```
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files. Keep `.env.example` files with empty values instead.

## Scripts (server)

| Command | What it does |
| --- | --- |
| `pnpm dev` | Run with auto-restart |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Run the compiled build |
| `pnpm typecheck` | Check types without building |
| `pnpm prisma studio` | Browse the database in a UI |

## API

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in, returns a JWT |
| GET | `/api/tasks` | Logged in | Own tasks (admins get all) |
| POST | `/api/tasks` | Logged in | Create a task |
| PATCH | `/api/tasks/:id` | Owner or admin | Update a task |
| DELETE | `/api/tasks/:id` | Owner or admin | Delete a task |

Protected routes need the header `Authorization: Bearer <token>`.

## How a Request Flows

```
Request -> validate (Zod) -> auth (JWT) -> authorize (role) -> controller -> service -> Prisma
                                   any error -> global error handler -> JSON response
```

Errors always return `{ "success": false, "message": "..." }`.

## Notes

- Passwords are stored as bcrypt hashes.
- `role` and `userId` are never taken from the request body. The user id comes from the JWT.
- If your network blocks port 5432, generate SQL with `prisma migrate diff` and run it in Neon's SQL Editor.
