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
- **Package manager:** pnpm (Workspace setup)

## Project Structure

```text
my-app/
├── pnpm-workspace.yaml                  # Monorepo workspace configuration
├── client/                              # Frontend React Application
│   ├── components.json                  # shadcn/ui configuration
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/                  # UI and functional components
│       │   └── ui/                      # shadcn/ui primitives
│       │       ├── Pagination.tsx
│       │       ├── ProtectedRoute.tsx
│       │       ├── TaskFilters.tsx
│       │       ├── TaskForm.tsx
│       │       └── TaskItem.tsx
│       ├── context/                     # Authentication context
│       ├── lib/                         # Axios instance and token management
│       ├── pages/                       # Application views (Login, Tasks, etc.)
│       ├── services/                    # API integration methods
│       ├── types/                       # Frontend TypeScript models
│       ├── utils/
│       ├── App.tsx
│       └── main.tsx
└── server/                              # Backend Express API
    ├── prisma/
    │   ├── migrations/
    │   └── schema.prisma                # Database models
    ├── prisma7.config.ts
    ├── Task App.postman_collection.json # Postman collection for API testing
    ├── package.json
    └── src/
        ├── config/                      # Environment variables validation
        ├── generated/prisma/            # Auto-generated Prisma client
        ├── lib/                         # Prisma client initialization
        ├── middlewares/                 # Auth, authorization, error handling, rate limiting
        ├── modules/                     # Feature-based module grouping (auth, tasks)
        ├── types/                       # Express Request type extensions
        ├── utils/                       # AppError, async catchers, auth helpers
        ├── app.ts                       # Express application setup
        └── server.ts                    # Entry point & server listener
