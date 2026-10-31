# Platform Adapters

## Overview

Platform adapters are responsible for interacting with external coding platforms (LeetCode, CodeChef, HackerRank, Codeforces). Each adapter:

1. Handles platform-specific API calls
2. Validates external responses
3. Normalizes data to a common schema
4. Ensures platform-specific data doesn't leak into analytics

## PlatformAdapter Architecture

Each adapter follows this structure:

```typescript
interface PlatformAdapter {
  name: string;
  fetchProblems: (params: { limit?: number, offset?: number }) => Promise<Problem[]>;
  fetchSubmissions: (params: { problemId: string, userId: string }) => Promise<Submission[]>;
  fetchUserActivity: (params: { userId: string, days: number }) => Promise<DailyActivity[]>;
  validateResponse: (response: any) => boolean;
  normalizeProblem: (raw: any) => Problem;
  normalizeSubmission: (raw: any) => Submission;
}
```

## Supported Platforms

The following platforms are targeted for integration:

1. LeetCode
2. CodeChef
3. HackerRank
4. Codeforces

## Integration Considerations

1. **API Availability**: Each platform's API must be verified before implementation
2. **Rate Limits**: Platform-specific rate limits must be respected
3. **Authentication**: Platform-specific authentication mechanisms must be supported
4. **Data Formats**: Each platform uses different data formats that need normalization

## Validation and Normalization

All external responses must be:

1. Validated against expected schemas
2. Normalized to a common format
3. Sanitized to prevent injection

Platform-specific data must be isolated from analytics to prevent platform-specific biases in metrics.