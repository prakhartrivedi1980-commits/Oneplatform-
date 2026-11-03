import { Platform } from '@oneplatform/database';
import { AccountVerificationCapability } from '../capabilities/account-verification.capability';
import { ProfileCapability } from '../capabilities/profile.capability';
import { PlatformProfile } from '../types/platform-profile.interface';
import { AdapterError, AdapterErrorCode } from '../errors/adapter-error.interface';

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

export class CodeforcesAdapter implements AccountVerificationCapability, ProfileCapability {
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
      // error is intentionally used in conditional checks
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