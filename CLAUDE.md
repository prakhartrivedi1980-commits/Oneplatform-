# OnePlatform — Claude Code Engineering Instructions


## OnePlatform Engineering Conventions

### 1. NestJS Dependency Injection

This project runs NestJS through tsx.

Do not rely solely on emitted decorator metadata for constructor injection.

Use explicit injection for NestJS dependencies:

```typescript
constructor(
  @Inject(SomeService)
  private readonly someService: SomeService,
) {}
```

Import Inject from `@nestjs/common`.

Apply this consistently to new services, guards, controllers, adapters, or other injectable providers where constructor injection is used.

Do not wait for runtime "dependency is undefined" errors before adding explicit injection.


### 2. Canonical Platform Integration Structure

All platform integration abstractions belong under:

```
apps/api/src/platforms/
```

Canonical structure:

```
apps/api/src/platforms/
├── capabilities/
├── types/
├── errors/
└── codeforces/
```

Future platform adapters should also live under this platforms hierarchy.

Do NOT create parallel platform abstractions under:

```
apps/api/src/capabilities/
apps/api/src/types/
apps/api/src/errors/
```

Before creating a new interface/type/error/helper, inspect the existing `apps/api/src/platforms/` hierarchy and reuse existing abstractions where possible.

Never create duplicate definitions merely because an existing file was not found immediately.

Do not search node_modules for OnePlatform source files.


### 3. Database Access

Use the shared `@oneplatform/database` DatabaseService for application database access.

Do NOT instantiate PrismaClient inside API controllers/services/adapters.

If another Prisma model delegate is required, extend DatabaseService minimally.

Reuse the existing DatabaseModule/provider architecture.


### 4. Prisma Schema and Migrations

Never modify:

```
packages/database/prisma/schema.prisma
```

and never create/apply migrations unless the task explicitly requires a schema change AND the user has reviewed/approved that change.

If a task appears to require a schema change:

- STOP.
- Report:
  - the blocker
  - proposed minimal schema change
  - why the current schema is insufficient

Wait for approval before modifying Prisma.

Do not create migrations merely to simplify application implementation.


### 5. Type and Interface Reuse

Before creating a new shared type/interface:

1. Inspect existing canonical directories
2. Search the repository source for an existing definition
3. Reuse or extend the existing canonical type

There must be one canonical definition for shared platform concepts such as:

- PlatformProfile
- PlatformSubmission
- AdapterError
- capability interfaces

Do not create duplicate copies in alternate directories.


### 6. Validation Workflow

Do NOT claim that lint/typecheck/tests/build passed unless the command actually executed successfully.

If Claude Code permissions, auto mode, network errors, or API errors prevent a command from running, report:

BLOCKED

with the exact command.

Do not describe a blocked command as passed.

During normal implementation, prefer this validation ladder:

First:
```
pnpm --filter api typecheck
```

After the feature is structurally complete:
```
pnpm --filter api lint
pnpm --filter api test
pnpm --filter api build
```

Before commit:
```
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Do not repeatedly run full repository validation after every small edit.

If execution permissions are blocked, stop and let the user run the command manually rather than repeatedly retrying.


### 7. ESLint Behavior

Be aware that this repository's lint scripts may use:

```
eslint --fix
```

Therefore lint can modify files.

After final lint/validation and before commit, always inspect:

```
git diff
git status
```

Do not assume the working tree is unchanged after lint.


### 8. Git Safety

Do not commit or push unless the current task explicitly instructs you to do so.

Before any commit:
- validation must be complete
- git diff must be reviewed
- git status must be reviewed
- temporary scripts/files must be removed
- .env files/secrets/tokens must not be staged
- schema/migration changes must match explicit approval

Never report "working tree clean" without actually checking git status.


### 9. External Platform Adapters

Keep external API fetching separate from persistence.

Adapters:
- fetch
- validate
- normalize
- translate upstream errors

Persistence services:
- persist normalized OnePlatform data

Orchestration services:
- coordinate fetching, persistence, and sync state

Do not combine all three responsibilities into one service.

External adapter tests must mock network calls for normal CI.

Live external API calls are acceptance tests only and must not be required by normal tests.


### 10. Task Scope Discipline

Make the smallest change required for the current task.

Do not start the next numbered task automatically.

Do not add:
- migrations
- background jobs
- Redis
- analytics
- frontend features
- additional platform integrations

unless they are explicitly part of the current task.

When a task says STOP after a report, stop.


### 11. Debugging Discipline

When validation fails:
- Fix the FIRST concrete failure
- Do not make speculative unrelated changes
- Inspect the actual current file before claiming what it contains
- Trust compiler/linter/runtime output over assumptions or previous reports

If a file's actual content contradicts a previous report, treat the file as the source of truth.

Do not repeatedly rewrite a working component while diagnosing an unrelated failure.


### 12. PowerShell vs Source Code

Do not instruct the user to paste TypeScript/JavaScript source code directly into PowerShell.

PowerShell is for commands such as:

```
pnpm
git
Get-Content
Select-String
Get-ChildItem
```

Source code belongs in source files and should be edited using code-editing tools.


## Additional OnePlatform Engineering Conventions from Tasks 5.1–5.3

### 13. NestJS Dependency Injection (Extended)

This project uses explicit NestJS dependency injection as described above.

### 14. Platform Integration Architecture (Tasks 5.1–5.3)

- All platform-specific code must adhere to the canonical `apps/api/src/platforms/` structure.
- Use existing capabilities, types, and error interfaces to avoid duplication.
- Platform-specific adapters should implement only the necessary capabilities.

### 15. Database and Transaction Management

- Use the DatabaseService for all database operations.
- Transactions should be used for bounded batches of operations to ensure atomicity.
- Never expose raw PrismaClient instances in application code.

### 16. Task-Specific Validation Rules

- For tasks involving platform integration:
  - Always validate with `pnpm --filter api typecheck` first.
  - Ensure all platform-specific interfaces are correctly imported and used.
  - Validate that external API calls are properly mocked in tests.

- For tasks involving persistence:
  - Ensure all database operations respect uniqueness constraints.
  - Validate that transactions handle failures gracefully.
  - Confirm that analytics models are not modified.

### 17. Error Handling and Logging

- Always validate external platform responses before processing.
- Log errors with structured logs rather than scattered console logging.
- Never expose internal stack traces to clients.

### 18. Testing Strategy

- Unit tests should mock external API calls.
- Integration tests should validate the complete workflow.
- Acceptance tests should validate real external API interactions only when necessary.

### 19. Security and Validation

- Never commit secrets, credentials, or environment variables.
- Validate all external inputs strictly.
- Use rate limiting and other security headers as appropriate.

### 20. Code Quality and Maintenance

- Keep files small and focused.
- Avoid deeply nested logic.
- Use dependency injection for services.
- Ensure all code follows TypeScript strict mode rules.



--- 

These conventions are designed to maintain consistency and scalability across the OnePlatform project.