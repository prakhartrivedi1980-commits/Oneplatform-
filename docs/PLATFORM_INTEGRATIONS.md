# OnePlatform Platform Integration Architecture

## Purpose and Architecture

OnePlatform uses a capability-oriented adapter architecture to integrate with external coding platforms. This approach allows each platform to implement only the capabilities it supports, rather than requiring every platform to implement a monolithic interface.

## Capability-Oriented Interfaces

```typescript
interface AccountVerificationCapability {
  verifyAccount(username: string): Promise<PlatformProfile>;
}

interface ProfileCapability {
  fetchProfile(username: string): Promise<PlatformProfile>;
}

interface SubmissionCapability {
  fetchSubmissions(
    username: string,
    options?: SubmissionFetchOptions,
  ): Promise<PlatformSubmission[]>;
}

interface RatingHistoryCapability {
  fetchRatingHistory(
    username: string,
  ): Promise<PlatformRatingChange[]>;
}
```

## Normalized Types

### PlatformProfile

```typescript
interface PlatformProfile {
  platform: Platform; // Required, OnePlatform enum
  username: string; // Required, platform-specific username
  externalId: string; // Required, platform-specific user ID (Codeforces: handle)
  profileUrl?: string; // Optional, URL to user profile
  displayName?: string; // Optional, user's display name (Codeforces: firstName + lastName)
  avatarUrl?: string; // Optional, URL to user avatar (Codeforces: avatar)
  rating?: number; // Optional, current rating (Codeforces: rating)
  maxRating?: number; // Optional, maximum rating (Codeforces: maxRating)
  rank?: string; // Optional, current rank (Codeforces: rank)
  metadata?: Record<string, unknown>; // Optional, platform-specific metadata
}
```

### PlatformSubmission

```typescript
interface PlatformSubmission {
  externalSubmissionId: string; // Required, platform-specific submission ID (Codeforces: id)
  platform: Platform; // Required, OnePlatform enum
  problemExternalId: string; // Required, platform-specific problem ID (Codeforces: contestId + index)
  problemName: string; // Required, problem name (Codeforces: problem.name)
  problemUrl?: string; // Optional, URL to problem (Codeforces: not directly provided, can be constructed)
  problemDifficulty?: number; // Optional, problem difficulty (Codeforces: problem.rating)
  problemTags?: string[]; // Optional, problem tags (Codeforces: problem.tags)
  status: SubmissionStatus; // Required, OnePlatform enum
  language?: string; // Optional, programming language (Codeforces: programmingLanguage)
  submittedAt: Date; // Required, submission time (Codeforces: creationTimeSeconds)
}
```

### PlatformRatingChange

```typescript
interface PlatformRatingChange {
  contestId: number; // Required, contest ID (Codeforces: contestId)
  contestName: string; // Required, contest name (Codeforces: contestName)
  rank: number; // Required, user's rank in the contest (Codeforces: rank)
  oldRating: number; // Required, old rating (Codeforces: oldRating)
  newRating: number; // Required, new rating (Codeforces: newRating)
  changedAt: Date; // Required, rating change time (Codeforces: ratingUpdateTimeSeconds)
}
```

## Codeforces API Integration

### Codeforces API Methods

1. **user.info**: Retrieves user profile information.
2. **user.status**: Retrieves user submission history.
3. **user.rating**: Retrieves user rating history.

### Codeforces Mappings

- **User**: `handle`
- **Submission**: `submission.id`
- **Problem**: `contestId + index`

### Verdict Normalization

```typescript
function mapVerdictToStatus(verdict: string): SubmissionStatus {
  switch (verdict) {
    case 'OK':
      return SubmissionStatus.ACCEPTED;
    case 'WRONG_ANSWER':
      return SubmissionStatus.WRONG_ANSWER;
    case 'TIME_LIMIT_EXCEEDED':
      return SubmissionStatus.TIME_LIMIT_EXCEEDED;
    case 'MEMORY_LIMIT_EXCEEDED':
      return SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
    case 'RUNTIME_ERROR':
      return SubmissionStatus.RUNTIME_ERROR;
    case 'COMPILATION_ERROR':
      return SubmissionStatus.COMPILE_ERROR;
    case 'PARTIAL':
      return SubmissionStatus.PARTIAL;
    default:
      return SubmissionStatus.OTHER;
  }
}
```

### Difficulty Normalization

Difficulty normalization is DEFERRED to the submission ingestion task.

### Adapter Error Model

```typescript
enum AdapterErrorCode {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  UPSTREAM_UNAVAILABLE = 'UPSTREAM_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

interface AdapterError {
  code: AdapterErrorCode;
  message: string;
  isRetryable: boolean;
  isSafeToExpose: boolean;
}
```

### HTTP Strategy

- Use built-in Node/WHATWG fetch.
- Use AbortController for timeout.
- Use URL / URLSearchParams for query construction.
- Explicit response-envelope validation.
- No automatic retry in the first implementation.

### Existing Prisma Compatibility

- **PlatformProfile**: Can be stored in `PlatformAccount` using `externalId`, `profileUrl`, and metadata fields.
- **PlatformSubmission**: Can be stored in `Submission` using `externalId`, `status`, `language`, and `submittedAt` fields. Problem details can be stored in `Problem` using `externalId`, `title`, `difficulty`, and `url` fields.

### What Task 5.3B Will Persist

For Task 5.3B, persist only fields supported by the existing schema:

- `platformUsername`: Verified Codeforces handle.
- `externalId`: Verified Codeforces handle.
- `profileUrl`: Constructed Codeforces profile URL.
- `syncStatus`: SUCCESS after successful verification.
- `lastSyncedAt`: Verification time.

### Testing Strategy

- Unit tests with mocked fetch for valid profile, nonexistent handle, valid submissions, verdict normalization, difficulty normalization, malformed API envelope, FAILED API envelope, network timeout, upstream failure, unknown verdict, and pagination.
- Normal CI tests do not call live Codeforces.

### Future Integration Sequence

1. Implement CodeforcesAdapter.
2. Implement AccountVerificationCapability and ProfileCapability.
3. Implement PlatformProfile.
4. Implement adapter error model.
5. Implement user.info HTTP integration.
6. Implement response-envelope validation.
7. Implement timeout handling.
8. Implement profile normalization.
9. Write unit tests with mocked fetch.
10. Integrate CODEFORCES PlatformAccount creation.

## Task 5.3B Exact Scope

**Task 5.3B**: Codeforces Account Verification + Profile Lookup

Implement:

- CodeforcesAdapter
- AccountVerificationCapability
- ProfileCapability
- PlatformProfile
- adapter error model
- user.info HTTP integration
- response-envelope validation
- timeout handling
- profile normalization
- unit tests with mocked fetch

Integrate CODEFORCES PlatformAccount creation so:

POST /api/v1/platform-accounts
        ↓
authenticated OnePlatform user
        ↓
CodeforcesAdapter.verifyAccount(username)
        ↓
official Codeforces user.info
        ↓
valid handle
        ↓
create PlatformAccount with:
  platformUsername
  externalId
  profileUrl
  syncStatus = SUCCESS
  lastSyncedAt

Invalid handle:
- do not create PlatformAccount
- return normalized client error

Other platforms:
- preserve current behavior for now
- do NOT implement LeetCode/CodeChef/HackerRank adapters in Task 5.3B

Do NOT implement:
- user.status
- submission ingestion
- rating-history persistence
- Redis/background jobs
- frontend connection UI
