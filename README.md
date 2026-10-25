# Task Manager

A small full-stack app for practice: users register, log in, and manage their own tasks. Admins can see and delete everyone's tasks. The frontend features a modern, responsive dashboard built with Tailwind CSS and accessible shadcn/ui components.

## Features

- **Authentication & Authorization:** JWT-based login with role-based access control (`USER`, `ADMIN`).
- **Task Management:** Create, read, update, and delete tasks with status, priority, and due date tracking.
- **Modern UI:** Fully responsive dashboard grid, paginated data viewing, and accessible forms using Radix UI primitives.
- **Strict Validation:** End-to-end type safety and payload validation using Zod on both client and server.

## Tech Stack

- **Client:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Server:** Node.js, Express 5, TypeScript
- **Database:** PostgreSQL on Neon, accessed with Prisma 7
- **Auth:** JWT with role-based access (`USER`, `ADMIN`)
- **Validation:** Zod
- **Package manager:** pnpm

## Project Structure

```text
my-app/
  client/                 # React app
    src/
      components/
        ui/               # shadcn/ui primitives (Button, Card, Dialog, etc.)
      pages/              # Page views (TasksPage, LoginPage, etc.)
      services/           # API integration
      types/              # Shared TypeScript interfaces
  server/                 # Express API
    prisma/schema.prisma  # Database models
    src/
      modules/
        auth/             # Register, login
        tasks/            # Task CRUD
      middlewares/        # auth, authorize, validate, errorHandler
      utils/              # AppError, catchAsync
      lib/prisma.ts       # Prisma client
      app.ts
      server.ts
```
