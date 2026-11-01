# OnePlatform Database Architecture

## Overview

Supabase PostgreSQL serves as the permanent source of truth for OnePlatform. Prisma ORM (version 5.19.1) is used for database access, providing type-safe interactions and migrations.

## Domain Model

The implemented domain model includes the following normalized tables:

1. **User**: Stores user information with unique email and name fields.
2. **PlatformAccount**: Tracks connections to external coding platforms (LeetCode, CodeChef, HackerRank, Codeforces) with appropriate indexes and unique constraints.
3. **Problem**: Normalized coding problems with platform-specific identifiers, difficulty levels, and topic categorization.
4. **Topic**: Categorization of problems with descriptions.
5. **ProblemTopic**: Many-to-many relationship between problems and topics.
6. **Submission**: User submissions for problems with status tracking, runtime, memory usage, and code snippets.
7. **DailyActivity**: Tracks user activity on a daily basis with solved count and total attempts.
8. **UserTopicStats**: User performance statistics by topic.
9. **Goal**: User-defined performance goals with target dates and statuses.
10. **Recommendation**: Suggested improvements for users with priority and status tracking.

## Normalization Strategy

Data from external platforms is normalized to a common schema:

1. **Platforms**: Standardized using an enum (LEETCODE, CODECHEF, HACKERRANK, CODEFORCES).
2. **Difficulty Levels**: Standardized using an enum (EASY, MEDIUM, HARD).
3. **Languages**: Standardized using an enum (JAVASCRIPT, TYPESCRIPT, PYTHON, JAVA, C, CPP, GO, RUST, OTHER).
4. **Submission Statuses**: Standardized using an enum (ACCEPTED, WRONG_ANSWER, TIME_LIMIT_EXCEEDED, COMPILE_ERROR, RUNTIME_ERROR, MEMORY_LIMIT_EXCEEDED, PARTIAL, PENDING, OTHER).
5. **Timestamps**: Standardized using PostgreSQL's `now()` and `DateTime` fields.
6. **UUIDs**: Used for all primary keys to ensure uniqueness across platforms.

## Database Principles

1. **Indexing**: Appropriate indexes are created for frequently queried fields:
   - Unique constraints on platform-specific identifiers.
   - Indexes on foreign keys and frequently queried fields.

2. **Constraints**: Foreign key constraints ensure referential integrity.
3. **Migrations**: Database migrations are managed using Prisma's migration system.
4. **Row-Level Security (RLS)**: Configured for all tables to ensure data protection.

## ORM Configuration

Prisma is configured to:

1. Generate TypeScript types from the schema.
2. Provide type-safe database access.
3. Handle connection pooling.
4. Support transactions.

## Migration Ownership

- **Migration File**: `packages/database/prisma/migrations/0001_init_oneplatform_schema/migration.sql`
- **Migration Status**: Applied successfully to Supabase.
- **Prisma Migrate Status**: Schema is up to date.

## Authentication Integration

### Supabase Auth

- **Provider**: Supabase Email authentication.
- **Identity Source**: Supabase auth.users table.
- **Application Data**: OnePlatform public.User table.

### User Synchronization Strategy

- **1:1 Relationship**: Each Supabase user maps to exactly one OnePlatform User.
- **Initial Sync**: When a Supabase user signs up, a corresponding OnePlatform User is created with:
  - `email` field populated from Supabase auth.users.email.
  - `name` field populated from Supabase auth.users.user_metadata.full_name if available.
  - Default values for other fields.
- **Update Sync**: On subsequent logins, the OnePlatform User is updated with any new metadata from Supabase.
- **Security**: No direct database triggers are used; synchronization is handled via application logic.

### Environment Variables

- **NEXT_PUBLIC_SUPABASE_URL**: Publicly accessible Supabase URL.
- **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY**: Supabase publishable key for browser usage.
- **SUPABASE_URL**: Supabase URL for server-side usage.
- **SUPABASE_PUBLISHABLE_KEY**: Supabase publishable key for server-side usage.

### Supabase Client Utilities

- **Browser**: `packages/shared/src/supabase/browser.ts`
- **Server**: `packages/shared/src/supabase/server.ts`

These utilities provide clean, reusable Supabase client instances for both browser and server environments.

## Supabase Configuration

- **Database Provider**: PostgreSQL
- **Row-Level Security (RLS)**: Enabled for all tables.
- **Tables**: All 10 application tables plus `_prisma_migrations` exist in Supabase Table Editor.

## Prisma Client Export

The `packages/database` package exports `PrismaClient` for clean usage in `apps/api` and `apps/worker`.

```typescript
// packages/database/src/index.ts
export * from '@prisma/client';
```