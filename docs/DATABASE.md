# OnePlatform Database Architecture

## Overview

Supabase PostgreSQL serves as the permanent source of truth for OnePlatform. Prisma will be used as the ORM for database access.

## Domain Model

The initial domain model concepts include:

1. **User**: Platform users
2. **PlatformAccount**: Connections to external coding platforms
3. **Problem**: Coding problems from external platforms
4. **Topic**: Categorization of problems
5. **ProblemTopic**: Many-to-many relationship between problems and topics
6. **Submission**: User submissions for problems
7. **DailyActivity**: User activity tracking
8. **UserTopicStats**: User performance statistics by topic
9. **Goal**: User-defined performance goals
10. **Recommendation**: Suggested improvements for users

## Normalization

Data from external platforms will be normalized to a common schema before being stored in PostgreSQL. This includes:

1. Standardizing problem difficulty levels
2. Normalizing timestamps
3. Standardizing language identifiers
4. Normalizing submission statuses

## Database Principles

1. **Indexing**: Appropriate indexes will be created for frequently queried fields
2. **Constraints**: Foreign key constraints will be used to maintain referential integrity
3. **Migrations**: Database migrations will be managed using Prisma's migration system

## ORM

Prisma will be configured to:

1. Generate TypeScript types from the schema
2. Provide type-safe database access
3. Handle connection pooling
4. Support transactions

We will not create an actual Prisma schema yet, as we need to finalize the domain model concepts first.