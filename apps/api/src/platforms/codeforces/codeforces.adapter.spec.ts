import { Test, TestingModule } from '@nestjs/testing';
import { CodeforcesAdapter } from './codeforces.adapter';
import { AdapterError, AdapterErrorCode } from '../errors/adapter-error.interface';
import { Platform } from '@oneplatform/database';

const mockFetch = jest.fn();

const mockValidResponse = {
  status: 'OK',
  result: [{
    handle: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    avatar: 'https://example.com/avatar.jpg',
    rating: 1500,
    maxRating: 1600,
    rank: 'expert',
  }],
};

const mockMissingFieldsResponse = {
  status: 'OK',
  result: [{
    handle: 'testuser',
  }],
};

const mockNotFoundResponse = {
  status: 'FAILED',
  comment: 'handles: User with handle nonexistent not found',
};

const mockMalformedResponse = {
  status: 'OK',
  // Missing result field
};

describe('CodeforcesAdapter', () => {
  let adapter: CodeforcesAdapter;

  beforeEach(async () => {
    global.fetch = mockFetch;

    const module: TestingModule = await Test.createTestingModule({
      providers: [CodeforcesAdapter],
    }).compile();

    adapter = module.get<CodeforcesAdapter>(CodeforcesAdapter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProfile', () => {
    it('should return normalized profile for valid Codeforces user', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockValidResponse),
      });

      const result = await adapter.fetchProfile('testuser');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://codeforces.com/api/user.info?handles=testuser'),
        expect.any(Object),
      );
      expect(result).toEqual({
        platform: Platform.CODEFORCES,
        username: 'testuser',
        externalId: 'testuser',
        profileUrl: 'https://codeforces.com/profile/testuser',
        displayName: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
        rating: 1500,
        maxRating: 1600,
        rank: 'expert',
      });
    });

    it('should handle missing optional fields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMissingFieldsResponse),
      });

      const result = await adapter.fetchProfile('testuser');

      expect(result).toEqual({
        platform: Platform.CODEFORCES,
        username: 'testuser',
        externalId: 'testuser',
        profileUrl: 'https://codeforces.com/profile/testuser',
      });
    });

    it('should throw USER_NOT_FOUND for nonexistent handle', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockNotFoundResponse),
      });

      await expect(adapter.fetchProfile('nonexistent')).rejects.toThrow(
        new AdapterError({
          code: AdapterErrorCode.USER_NOT_FOUND,
          message: 'Codeforces user nonexistent not found',
          isRetryable: false,
          isSafeToExpose: true,
        }),
      );
    });

    it('should throw INVALID_RESPONSE for malformed envelope', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockMalformedResponse),
      });

      await expect(adapter.fetchProfile('testuser')).rejects.toThrow(
        new AdapterError({
          code: AdapterErrorCode.INVALID_RESPONSE,
          message: 'Codeforces API response missing user data',
          isRetryable: false,
          isSafeToExpose: false,
        }),
      );
    });

    it('should throw TIMEOUT for aborted request', async () => {
      mockFetch.mockImplementationOnce(() => {
        throw new DOMException('The operation was aborted.', 'AbortError');
      });

      await expect(adapter.fetchProfile('testuser')).rejects.toThrow(
        new AdapterError({
          code: AdapterErrorCode.TIMEOUT,
          message: 'Codeforces API request timed out',
          isRetryable: true,
          isSafeToExpose: true,
        }),
      );
    });

    it('should throw NETWORK_ERROR for network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(adapter.fetchProfile('testuser')).rejects.toThrow(
        new AdapterError({
          code: AdapterErrorCode.NETWORK_ERROR,
          message: 'Network error while calling Codeforces API',
          isRetryable: true,
          isSafeToExpose: false,
        }),
      );
    });
  });
});
