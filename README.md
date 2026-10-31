# OnePlatform

OnePlatform is a unified coding progress and analytics platform for students. It brings coding activity from platforms such as LeetCode, CodeChef, HackerRank, and Codeforces into one dashboard.

## Architecture

OnePlatform follows a modular-monolith architecture with independent worker processes. The architecture is documented in the [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) file.

## Repository Structure

```

├── apps/
│   ├── web/          # Next.js frontend application
│   ├── api/          # NestJS API application
│   └── worker/       # Background job processing
│
├── packages/
│   ├── database/     # Database access and ORM layer
│   ├── shared/       # Shared utilities and types
│   ├── ui/           # UI components
│   └── config/       # Shared configuration
│
├── docs/             # Architecture documentation
├── .env.example       # Environment variables template
└── package.json       # Root package configuration
```

## Core Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **Caching**: Redis
- **Queue System**: BullMQ
- **Package Manager**: pnpm
- **Build Tool**: Turborepo

## Prerequisites

- Node.js (v20.x recommended)
- pnpm
- Docker (for local infrastructure)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

## Development Commands

Run the following commands to start development:

```bash
# Start all applications in development mode
pnpm dev

# Lint the codebase
pnpm lint

# Typecheck the codebase
pnpm typecheck

# Build the applications
pnpm build
```

## Running Applications

Each application can be run individually:

```bash
# Web application
cd apps/web
pnpm dev

# API application
cd apps/api
pnpm start:dev

# Worker application
cd apps/worker
pnpm dev
```

## API Endpoints

The API provides the following endpoints:

- `GET /api/v1/health` - Health check endpoint

To test the API, you can use a tool like Postman or curl:

```bash
curl http://localhost:3000/api/v1/health
```

## Architecture Documentation

The architecture is documented in the [docs/](docs/) directory.

## Environment Variables

Configuration variables are defined in the [.env.example](.env.example) file. Create a `.env` file in the root directory with your own values.

## License

This project is licensed under the MIT License.