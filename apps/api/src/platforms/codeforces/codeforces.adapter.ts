import { Platform } from '@oneplatform/database';
import { AccountVerificationCapability } from '../../platforms/capabilities/account-verification.capability';
import { ProfileCapability } from '../../platforms/capabilities/profile.capability';
import { SubmissionFetchOptions } from '../../platforms/capabilities/submission.capability';
import { PlatformProfile } from '../../platforms/types/platform-profile.interface';
import { PlatformSubmission } from '../../platforms/types/platform-submission.interface';
import { SubmissionStatus } from '@oneplatform/database';
import { normalizeDifficulty } from '../capabilities/difficulty.normalization';
import { AdapterError, AdapterErrorCode } from '../../platforms/errors/adapter-error.interface';

const CODEFORCES_API_BASE_URL = 'https://codeforces.com/api';
const REQUEST_TIMEOUT_MS = 10000;

interface CodeforcesUserInfoResponse {
  status: string;
  result?: Array<{
    handle: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    titlePhoto?: string;
    rating?: number;
    maxRating?: number;
    rank?: string;
  }>;
  comment?: string;
}

interface CodeforcesUserStatusResponse {
  status: string;
  result?: Array<{
    id: string;
    creationTimeSeconds: number;
    problem: {
      contestId: number;
      index: string;
      name: string;
      rating?: number;
      tags?: string[];
    };
    programmingLanguage?: string;
    verdict: string;
    testdate?: string;
  }>;
  comment?: string;
}

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


interface SubmissionCapability {
  fetchSubmissions(username: string, options?: SubmissionFetchOptions): Promise<PlatformSubmission[]>;
}

export class CodeforcesAdapter implements AccountVerificationCapability, ProfileCapability, SubmissionCapability {
  async verifyAccount(username: string): Promise<PlatformProfile> {
    return this.fetchProfile(username);
  }

  async fetchProfile(username: string): Promise<PlatformProfile> {
    const url = new URL(`${CODEFORCES_API_BASE_URL}/user.info`);
    url.searchParams.append('handles', username);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new AdapterError({
          code: AdapterErrorCode.UPSTREAM_UNAVAILABLE,
          message: `Codeforces API request failed with status ${response.status}`,
          isRetryable: true,
          isSafeToExpose: false,
        });
      }

      let data: CodeforcesUserInfoResponse;
      try {
        data = await response.json();
      } catch {
        throw new AdapterError({
          code: AdapterErrorCode.INVALID_RESPONSE,
          message: 'Failed to parse Codeforces API response',
          isRetryable: false,
          isSafeToExpose: false,
        });
      }

      if (data.status !== 'OK') {
        if (data.comment?.includes('not found')) {
          throw new AdapterError({
            code: AdapterErrorCode.USER_NOT_FOUND,
            message: `Codeforces user ${username} not found`,
            isRetryable: false,
            isSafeToExpose: true,
          });
        }
        throw new AdapterError({
          code: AdapterErrorCode.UPSTREAM_UNAVAILABLE,
          message: `Codeforces API error: ${data.comment}`,
          isRetryable: true,
          isSafeToExpose: false,
        });
      }

      if (!data.result || data.result.length === 0) {
        throw new AdapterError({
          code: AdapterErrorCode.INVALID_RESPONSE,
          message: 'Codeforces API response missing user data',
          isRetryable: false,
          isSafeToExpose: false,
        });
      }

      const user = data.result[0];
      const profileUrl = `https://codeforces.com/profile/${encodeURIComponent(username)}`;
      const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ');

      return {
        platform: Platform.CODEFORCES,
        username: user.handle,
        externalId: user.handle,
        profileUrl,
        displayName: displayName || undefined,
        avatarUrl: user.avatar || user.titlePhoto || undefined,
        rating: user.rating,
        maxRating: user.maxRating,
        rank: user.rank,
      };
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AdapterError({
          code: AdapterErrorCode.TIMEOUT,
          message: 'Codeforces API request timed out',
          isRetryable: true,
          isSafeToExpose: true,
        });
      }
      throw new AdapterError({
        code: AdapterErrorCode.NETWORK_ERROR,
        message: 'Network error while calling Codeforces API',
        isRetryable: true,
        isSafeToExpose: false,
      });
    }
  }

  async fetchSubmissions(username: string, options?: SubmissionFetchOptions): Promise<PlatformSubmission[]> {
    const { from = 1, count = 100 } = options || {};

    // Validate pagination inputs
    if (from < 1 || count < 1 || count > 1000) {
      throw new AdapterError({
        code: AdapterErrorCode.INVALID_RESPONSE,
        message: 'Invalid pagination parameters',
        isRetryable: false,
        isSafeToExpose: false,
      });
    }

    const url = new URL(`${CODEFORCES_API_BASE_URL}/user.status`);
    url.searchParams.append('handle', username);
    url.searchParams.append('from', from.toString());
    url.searchParams.append('count', count.toString());

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url.toString(), { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new AdapterError({
          code: AdapterErrorCode.UPSTREAM_UNAVAILABLE,
          message: `Codeforces API request failed with status ${response.status}`,
          isRetryable: true,
          isSafeToExpose: false,
        });
      }

      let data: CodeforcesUserStatusResponse;
      try {
        data = await response.json();
      } catch {
        throw new AdapterError({
          code: AdapterErrorCode.INVALID_RESPONSE,
          message: 'Failed to parse Codeforces API response',
          isRetryable: false,
          isSafeToExpose: false,
        });
      }

      if (data.status !== 'OK') {
        if (data.comment?.includes('not found')) {
          throw new AdapterError({
            code: AdapterErrorCode.USER_NOT_FOUND,
            message: `Codeforces user ${username} not found`,
            isRetryable: false,
            isSafeToExpose: true,
          });
        }
        throw new AdapterError({
          code: AdapterErrorCode.UPSTREAM_UNAVAILABLE,
          message: `Codeforces API error: ${data.comment}`,
          isRetryable: true,
          isSafeToExpose: false,
        });
      }

      if (!data.result || data.result.length === 0) {
        return []; // Return empty array for no submissions
      }

      return data.result.map(submission => {
        // Skip if contestId or index is missing
        if (!submission.problem.contestId || !submission.problem.index) {
          return null;
        }

        const problemExternalId = `${submission.problem.contestId}-${submission.problem.index}`;
        const problemUrl = `https://codeforces.com/contest/${submission.problem.contestId}/problem/${encodeURIComponent(submission.problem.index)}`;

        return {
          externalSubmissionId: submission.id.toString(),
          platform: Platform.CODEFORCES,
          problemExternalId,
          problemName: submission.problem.name,
          problemUrl,
          problemRating: submission.problem.rating,
        problemDifficulty: normalizeDifficulty(submission.problem.rating),
          problemTags: submission.problem.tags || [],
          status: mapVerdictToStatus(submission.verdict),
          language: submission.programmingLanguage,
          submittedAt: new Date(submission.creationTimeSeconds * 1000),
        };
      }).filter(Boolean) as PlatformSubmission[];
    } catch (error) {
      if (error instanceof AdapterError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AdapterError({
          code: AdapterErrorCode.TIMEOUT,
          message: 'Codeforces API request timed out',
          isRetryable: true,
          isSafeToExpose: true,
        });
      }
      throw new AdapterError({
        code: AdapterErrorCode.NETWORK_ERROR,
        message: 'Network error while calling Codeforces API',
        isRetryable: true,
        isSafeToExpose: false,
      });
    }
  }
}