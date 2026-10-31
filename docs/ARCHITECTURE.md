# OnePlatform Architecture

## Overview

OnePlatform follows a modular-monolith architecture with independent worker processes. This approach balances the benefits of monolithic development with the scalability of microservices.

## Application Structure

The project is organized into three main application areas:

1. **apps/web**: Frontend application
2. **apps/api**: REST API service
3. **apps/worker**: Background job processing

## Package Structure

The project includes several shared packages:

1. **packages/database**: Database access and ORM layer
2. **packages/shared**: Shared utilities and types
3. **packages/ui**: UI components and design system
4. **packages/config**: Shared configuration

## Data Flow

The major data flow in the system is:

1. External platform data
2. Platform adapter
3. Validation
4. Normalization
5. PostgreSQL (Supabase)
6. Analytics processing
7. Caching layer
8. API
9. Frontend

## Why Not Microservices?

We are starting with a modular monolith because:

1. It simplifies initial development and deployment
2. It allows for easier refactoring to microservices later
3. It provides better performance for our initial use cases
4. It simplifies data consistency management
5. It reduces the complexity of inter-service communication

This architecture provides a good balance between development velocity and long-term maintainability.