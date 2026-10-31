\# OnePlatform — Claude Code Engineering Instructions



\## 1. Product Overview



OnePlatform is a unified coding-progress and analytics platform for students.



Students can connect profiles from coding platforms such as:



\- LeetCode

\- CodeChef

\- HackerRank

\- Codeforces

\- Additional platforms in the future



OnePlatform collects coding activity, normalizes it into a common data model,

and provides:



\- unified coding statistics

\- progress tracking

\- topic-level analysis

\- difficulty analysis

\- coding streaks

\- activity history

\- weak-topic detection

\- recommendations

\- goals

\- achievements

\- leaderboards

\- AI-assisted learning insights



The system must be designed as a maintainable production application,

not as a temporary prototype.





\# 2. Core Technology Stack



Do not replace these technologies without explicit user approval.



\## Frontend



\- Next.js

\- React

\- TypeScript

\- Tailwind CSS

\- shadcn/ui

\- Framer Motion / Motion

\- Recharts



\## Backend



\- NestJS

\- TypeScript

\- REST API

\- Swagger / OpenAPI



\## Database



\- Supabase PostgreSQL



PostgreSQL is the permanent source of truth.



\## ORM



\- Prisma



\## Authentication



\- Supabase Auth



Initial authentication providers may include:



\- Email

\- Google

\- GitHub



\## Cache



\- Redis



\## Background Jobs



\- BullMQ

\- Redis



\## Worker



\- Node.js

\- TypeScript



\## Repository



\- pnpm workspaces

\- Turborepo



\## Infrastructure



\- Docker

\- Docker Compose

\- GitHub

\- GitHub Actions





\# 3. Target Repository Architecture



The repository should evolve toward:



Oneplatform/

├── apps/

│   ├── web/

│   ├── api/

│   └── worker/

│

├── packages/

│   ├── database/

│   ├── shared/

│   ├── ui/

│   └── config/

│

├── docs/

│   ├── ARCHITECTURE.md

│   ├── DATABASE.md

│   ├── PLATFORM\_ADAPTERS.md

│   ├── CACHE.md

│   ├── QUEUES.md

│   ├── API.md

│   ├── DESIGN\_SYSTEM.md

│   ├── SECURITY.md

│   └── TESTING.md

│

├── .claude/

│   └── settings.json

│

├── CLAUDE.md

├── .env.example

├── .gitignore

├── docker-compose.yml

├── pnpm-workspace.yaml

├── turbo.json

├── package.json

└── README.md



Do not create unnecessary top-level directories.





\# 4. Architecture Style



OnePlatform uses a:



MODULAR MONOLITH + INDEPENDENT BACKGROUND WORKER



Do NOT convert the application to microservices unless explicitly requested.



The API should contain clearly separated domain modules.



Examples:



\- auth

\- users

\- platforms

\- profiles

\- submissions

\- problems

\- analytics

\- recommendations

\- goals

\- leaderboards

\- health



Keep domain boundaries clear even though the API is deployed as one application.





\# 5. Application Responsibilities



\## apps/web



Responsible for:



\- UI

\- routing

\- dashboard

\- authentication experience

\- analytics visualization

\- profile management

\- platform connection UI

\- goals

\- recommendations

\- responsive design



Do not put core backend business logic in the frontend.





\## apps/api



Responsible for:



\- REST API

\- authorization

\- validation

\- domain/business logic

\- database access

\- queueing background jobs

\- analytics retrieval

\- platform account management



Controllers must remain thin.



Business logic belongs in services/domain components.





\## apps/worker



Responsible for:



\- coding-platform synchronization

\- scheduled synchronization

\- expensive background processing

\- retryable jobs

\- analytics recalculation jobs

\- future recommendation-generation jobs



Do not perform long-running synchronization inside HTTP request handlers.





\# 6. Platform Adapter Architecture



External coding platforms must use adapters.



Do NOT scatter LeetCode, CodeChef, HackerRank, or Codeforces-specific logic

through the application.



Use a common abstraction similar to:



PlatformAdapter

├── LeetCodeAdapter

├── CodeChefAdapter

├── HackerRankAdapter

└── CodeforcesAdapter



Adapters should expose normalized operations such as:



\- getProfile()

\- getSubmissions()

\- getStats()



Exact interfaces should be designed when implementation begins.



All external responses must be validated and normalized before entering

the core domain.



Platform-specific response structures must NOT leak into:



\- analytics

\- dashboard logic

\- recommendation logic

\- shared domain models





\# 7. Data Flow



The intended high-level flow is:



External Coding Platform

&#x20;       ↓

Platform Adapter

&#x20;       ↓

Validation

&#x20;       ↓

Normalization

&#x20;       ↓

PostgreSQL

&#x20;       ↓

Analytics Engine

&#x20;       ↓

Redis Cache

&#x20;       ↓

REST API

&#x20;       ↓

Web Dashboard



Background synchronization should follow:



Scheduler / API

&#x20;       ↓

BullMQ

&#x20;       ↓

Redis

&#x20;       ↓

Worker

&#x20;       ↓

Platform Adapter

&#x20;       ↓

Normalization

&#x20;       ↓

PostgreSQL

&#x20;       ↓

Analytics recalculation

&#x20;       ↓

Cache invalidation





\# 8. Database Rules



Supabase PostgreSQL is the permanent source of truth.



Use Prisma for application database access unless there is a documented

technical reason not to.



Core entities are expected to include concepts such as:



\- User

\- PlatformAccount

\- Problem

\- Topic

\- ProblemTopic

\- Submission

\- DailyActivity

\- UserTopicStats

\- Goal

\- Recommendation



Do not create duplicate tables for each coding platform when normalized

tables can represent the same concept.



Prefer:



PlatformAccount

Submission

Problem



with a platform field.



Avoid:



LeetCodeSubmission

CodeChefSubmission

HackerRankSubmission



unless there is a compelling documented reason.



Use:



\- primary keys

\- foreign keys

\- indexes

\- unique constraints

\- timestamps



appropriately.



Never run destructive production database operations automatically.





\# 9. Redis Rules



Redis is NOT permanent storage.



Redis may be used for:



\- caching

\- BullMQ

\- rate limiting

\- temporary synchronization state

\- distributed locks when required



Permanent user data belongs in PostgreSQL.



Use predictable namespaced cache keys.



Examples:



user:{id}:dashboard

user:{id}:stats

user:{id}:recommendations

leaderboard:weekly



Cache invalidation must be considered whenever source data changes.





\# 10. Queue Rules



Use BullMQ for background work.



Jobs should be:



\- idempotent where practical

\- retryable

\- observable

\- small and focused



External-platform jobs must account for:



\- API failures

\- timeouts

\- rate limits

\- partial responses

\- duplicate data

\- retries



Do not create uncontrolled request loops against external platforms.





\# 11. Analytics Rules



Statistics must be calculated from stored/verified data.



Examples:



\- total solved

\- difficulty distribution

\- topic performance

\- language usage

\- daily activity

\- weekly activity

\- streaks

\- platform distribution

\- improvement trends



Do not use an LLM to calculate factual statistics.



The deterministic analytics layer must produce structured insights first.



Future AI functionality may explain or recommend based on those structured

insights.





\# 12. AI Feature Architecture



Future AI features should follow:



Database

&#x20;  ↓

Analytics Engine

&#x20;  ↓

Structured Insights

&#x20;  ↓

AI Recommendation Layer

&#x20;  ↓

Student



Never ask an LLM to invent statistics about the student.



All numbers presented to the AI layer must originate from verified

application data.





\# 13. API Conventions



Public application endpoints should use:



/api/v1/\*



Use REST unless explicitly approved otherwise.



Use:



\- proper HTTP status codes

\- DTO validation

\- consistent error responses

\- pagination for large collections

\- authentication guards

\- authorization checks



Document APIs with Swagger/OpenAPI.



Do not expose internal stack traces to clients.





\# 14. Frontend Design Direction



OnePlatform should feel like a modern developer analytics product.



General inspiration:



\- GitHub

\- Linear

\- Vercel

\- modern analytics dashboards



The UI should be:



\- clean

\- modern

\- responsive

\- interactive

\- developer-focused

\- information-dense without being cluttered



Prefer a polished dark-mode experience while maintaining accessibility.



Avoid:



\- excessive gradients

\- excessive glassmorphism

\- unnecessary animations

\- random colors

\- inconsistent spacing

\- oversized dashboard cards



Use animation purposefully for:



\- counters

\- charts

\- progress

\- transitions

\- loading states

\- achievements

\- synchronization status



Use a consistent design system.





\# 15. Security Rules



Never expose secrets.



Never commit:



\- .env

\- access tokens

\- API keys

\- passwords

\- database credentials

\- Supabase service-role keys

\- GitHub credentials



Use environment variables.



Maintain `.env.example` containing variable names only.



Validate all external input.



Treat data received from coding platforms as untrusted input.



Apply appropriate:



\- authentication

\- authorization

\- rate limiting

\- CORS

\- security headers

\- request validation

\- output sanitization



Do not log secrets.





\# 16. TypeScript Rules



Use TypeScript strict mode.



Avoid `any`.



If `any` is unavoidable, document why.



Prefer:



\- explicit domain types

\- schemas for external data

\- reusable shared contracts

\- type-safe database access



Do not duplicate interfaces across applications when they belong in

packages/shared.





\# 17. Code Quality



Prefer:



\- small focused functions

\- clear naming

\- dependency injection

\- modular services

\- reusable components

\- explicit error handling



Avoid:



\- giant files

\- deeply nested logic

\- duplicated business logic

\- unexplained magic values

\- premature abstractions

\- unnecessary dependencies



Do not refactor unrelated working code while implementing a feature.





\# 18. Testing



Changes should be verified appropriately.



Before considering substantial work complete, run relevant:



\- lint

\- typecheck

\- unit tests

\- integration tests

\- build



Do not claim a command succeeded unless it was actually run successfully.



If a check fails because of the current change, fix it before committing.



If a pre-existing failure exists, report it clearly rather than hiding it.





\# 19. Documentation



Architecture decisions should be reflected in `/docs`.



Before changing an established subsystem, read its relevant documentation.



Important documentation:



\- ARCHITECTURE.md

\- DATABASE.md

\- PLATFORM\_ADAPTERS.md

\- CACHE.md

\- QUEUES.md

\- API.md

\- DESIGN\_SYSTEM.md

\- SECURITY.md

\- TESTING.md



Update documentation when architecture materially changes.





\# 20. Git Policy — CRITICAL



The project uses ONLY the `main` branch for current development.



Before starting work, verify:



git branch --show-current



It MUST return:



main



DO NOT create branches.



DO NOT use:



git checkout -b

git switch -c



DO NOT create:



\- feature branches

\- fix branches

\- development branches

\- temporary branches



Work directly on `main`.





\# 21. Git Safety



Never run automatically:



git push --force

git push -f

git reset --hard

git clean -fd



Never rewrite published Git history.



Never delete repository history.



Never change the origin remote unless explicitly instructed.



The expected remote is:



https://github.com/prakhartrivedi1980-commits/Oneplatform-.git



The expected push target is:



origin main





\# 22. Git Workflow



At the beginning of a development task:



1\. Run:



&#x20;  git status



2\. Run:



&#x20;  git branch --show-current



3\. Confirm the branch is `main`.



4\. Inspect relevant existing files before modifying them.



Do not blindly overwrite existing user work.





After implementation:



1\. Run relevant lint checks.

2\. Run typecheck.

3\. Run relevant tests.

4\. Run build when appropriate.

5\. Run:



&#x20;  git status



6\. Review:



&#x20;  git diff



7\. Stage only intended files.



8\. Commit with a clear descriptive commit message.



9\. Push using:



&#x20;  git push origin main



Never force push.





\# 23. Commit Style



Use clear commit messages.



Preferred examples:



feat: add LeetCode platform adapter



feat: implement dashboard analytics endpoint



fix: correct streak calculation



refactor: normalize platform submission mapping



test: add analytics service tests



docs: document platform adapter architecture



chore: configure monorepo workspace



Do not use meaningless messages such as:



update

changes

stuff

fix things





\# 24. Agent Working Procedure



For every substantial task:



1\. Understand the request.



2\. Read CLAUDE.md.



3\. Inspect relevant repository files.



4\. Read relevant `/docs` files.



5\. Check Git status and current branch.



6\. Understand the existing implementation before changing it.



7\. Plan the smallest coherent implementation.



8\. Implement only the requested scope.



9\. Validate the implementation.



10\. Run relevant tests/checks.



11\. Review the resulting diff.



12\. Update documentation when necessary.



13\. Commit completed work.



14\. Push to `origin main` when the task is complete and checks pass.



Do not create branches.





\# 25. Autonomous Work Rules



The agent may autonomously:



\- create project files

\- create application modules

\- install normal project dependencies

\- modify application code

\- write tests

\- run tests

\- run lint

\- run typecheck

\- run builds

\- run safe Docker commands

\- run safe Prisma commands

\- create migrations

\- update documentation

\- commit completed work

\- push completed work to origin/main



The agent must stop and ask before:



\- deleting important user data

\- resetting a database

\- deleting Docker volumes

\- force pushing

\- rewriting Git history

\- changing the architecture substantially

\- replacing a core technology

\- removing major working functionality

\- exposing a new public service

\- performing an operation with unclear destructive consequences





\# 26. Dependency Policy



Before adding a dependency:



1\. determine whether existing dependencies already solve the problem

2\. prefer actively maintained packages

3\. avoid unnecessary dependencies

4\. install the dependency in the correct workspace

5\. update the lockfile



Do not introduce a new framework when the existing stack can solve the

problem.





\# 27. Scope Discipline



Do not turn small tasks into repository-wide rewrites.



If asked to implement one feature:



\- modify the relevant modules

\- add necessary tests

\- update relevant documentation

\- leave unrelated working systems alone



Do not perform speculative refactoring unless it directly enables the

requested task.





\# 28. Error Handling



Never silently swallow errors.



External platform failures should provide enough structured information

for:



\- retries

\- logging

\- monitoring

\- debugging



Do not expose sensitive internal information to frontend clients.





\# 29. Observability



Design important operations so they can eventually expose:



\- request latency

\- database latency

\- cache performance

\- queue depth

\- synchronization failures

\- external API failures

\- worker processing time

\- rate-limit events



Use structured logs rather than scattered console logging in production

code.





\# 30. Current Development Principle



Build OnePlatform incrementally.



Do NOT attempt to implement the entire product in one task.



Preferred progression:



1\. repository foundation

2\. monorepo

3\. infrastructure

4\. database

5\. authentication

6\. platform adapter abstraction

7\. first platform integration

8\. synchronization worker

9\. analytics

10\. dashboard

11\. additional platforms

12\. recommendations

13\. AI features

14\. social/leaderboard features

15\. production hardening



Each stage should leave the repository in a working state.

