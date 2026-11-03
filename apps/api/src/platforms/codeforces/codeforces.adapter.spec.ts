import { CodeforcesAdapter } from './codeforces.adapter';
import { Platform, SubmissionStatus } from '@oneplatform/database';

const mockFetch = jest.fn();

beforeEach(() => {
  global.fetch = mockFetch;
  jest.clearAllMocks();
});

describe('CodeforcesAdapter', () => {
  const adapter = new CodeforcesAdapter();

  describe('fetchSubmissions', () => {
    it('should fetch submissions with default pagination', async () => {
      const mockResponse = {
        status: 'OK',
        result: [
          {
            id: '123',
            creationTimeSeconds: 1625097600,
            problem: {
              contestId: 1234,
              index: 'A',
              name: 'Test Problem',
              rating: 1200,
              tags: ['dp'],
            },
            programmingLanguage: 'GNU C++17',
            verdict: 'OK',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const submissions = await adapter.fetchSubmissions('testuser');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://codeforces.com/api/user.status'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('handle=testuser'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('from=1'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('count=100'),
        expect.any(Object)
      );

      expect(submissions).toEqual([
        {
          externalSubmissionId: '123',
          platform: Platform.CODEFORCES,
          problemExternalId: '1234-A',
          problemName: 'Test Problem',
          problemUrl: 'https://codeforces.com/contest/1234/problem/A',
          problemRating: 1200,
          problemTags: ['dp'],
          status: SubmissionStatus.ACCEPTED,
          language: 'GNU C++17',
          submittedAt: new Date(1625097600 * 1000),
        },
      ]);
    });

    it('should fetch submissions with custom pagination', async () => {
      const mockResponse = {
        status: 'OK',
        result: [
          {
            id: '123',
            creationTimeSeconds: 1625097600,
            problem: {
              contestId: 1234,
              index: 'A',
              name: 'Test Problem',
              rating: 1200,
              tags: ['dp'],
            },
            programmingLanguage: 'GNU C++17',
            verdict: 'OK',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const submissions = await adapter.fetchSubmissions('testuser', { from: 2, count: 50 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://codeforces.com/api/user.status'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('handle=testuser'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('from=2'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('count=50'),
        expect.any(Object)
      );

      expect(submissions).toEqual([
        {
          externalSubmissionId: '123',
          platform: Platform.CODEFORCES,
          problemExternalId: '1234-A',
          problemName: 'Test Problem',
          problemUrl: 'https://codeforces.com/contest/1234/problem/A',
          problemRating: 1200,
          problemTags: ['dp'],
          status: SubmissionStatus.ACCEPTED,
          language: 'GNU C++17',
          submittedAt: new Date(1625097600 * 1000),
        },
      ]);
    });

    it('should handle missing contestId or index', async () => {
      const mockResponse = {
        status: 'OK',
        result: [
          {
            id: '123',
            creationTimeSeconds: 1625097600,
            problem: {
              contestId: undefined,
              index: 'A',
              name: 'Test Problem',
              rating: 1200,
              tags: ['dp'],
            },
            programmingLanguage: 'GNU C++17',
            verdict: 'OK',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const submissions = await adapter.fetchSubmissions('testuser');

      expect(submissions).toEqual([]);
    });

    it('should map verdicts correctly', async () => {
      const testCases = [
        { verdict: 'OK', expected: SubmissionStatus.ACCEPTED },
        { verdict: 'WRONG_ANSWER', expected: SubmissionStatus.WRONG_ANSWER },
        { verdict: 'TIME_LIMIT_EXCEEDED', expected: SubmissionStatus.TIME_LIMIT_EXCEEDED },
        { verdict: 'MEMORY_LIMIT_EXCEEDED', expected: SubmissionStatus.MEMORY_LIMIT_EXCEEDED },
        { verdict: 'RUNTIME_ERROR', expected: SubmissionStatus.RUNTIME_ERROR },
        { verdict: 'COMPILATION_ERROR', expected: SubmissionStatus.COMPILE_ERROR },
        { verdict: 'PARTIAL', expected: SubmissionStatus.PARTIAL },
        { verdict: 'UNKNOWN_VERDICT', expected: SubmissionStatus.OTHER },
      ];

      for (const testCase of testCases) {
        const mockResponse = {
          status: 'OK',
          result: [
            {
              id: '123',
              creationTimeSeconds: 1625097600,
              problem: {
                contestId: 1234,
                index: 'A',
                name: 'Test Problem',
                rating: 1200,
                tags: ['dp'],
              },
              programmingLanguage: 'GNU C++17',
              verdict: testCase.verdict,
            },
          ],
        };

        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockResponse),
        });

        const submissions = await adapter.fetchSubmissions('testuser');

        expect(submissions[0].status).toBe(testCase.expected);
      }
    });

    it('should handle missing rating', async () => {
      const mockResponse = {
        status: 'OK',
        result: [
          {
            id: '123',
            creationTimeSeconds: 1625097600,
            problem: {
              contestId: 1234,
              index: 'A',
              name: 'Test Problem',
              rating: undefined,
              tags: ['dp'],
            },
            programmingLanguage: 'GNU C++17',
            verdict: 'OK',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const submissions = await adapter.fetchSubmissions('testuser');

      expect(submissions[0].problemRating).toBeUndefined();
    });

    it('should handle missing optional fields', async () => {
      const mockResponse = {
        status: 'OK',
        result: [
          {
            id: '123',
            creationTimeSeconds: 1625097600,
            problem: {
              contestId: 1234,
              index: 'A',
              name: 'Test Problem',
            },
            verdict: 'OK',
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const submissions = await adapter.fetchSubmissions('testuser');

      expect(submissions[0].problemRating).toBeUndefined();
      expect(submissions[0].problemTags).toEqual([]);
      expect(submissions[0].language).toBeUndefined();
    });

    it('should handle FAILED envelope', async () => {
      const mockResponse = {
        status: 'FAILED',
        comment: 'User not found',
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      await expect(adapter.fetchSubmissions('nonexistentuser')).rejects.toThrow();
    });

    it('should handle malformed response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
      });

      await expect(adapter.fetchSubmissions('testuser')).rejects.toThrow();
    });

    it('should handle timeout', async () => {
      mockFetch.mockImplementationOnce(() => new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 100);
      }));

      await expect(adapter.fetchSubmissions('testuser')).rejects.toThrow();
    });

    it('should handle network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(adapter.fetchSubmissions('testuser')).rejects.toThrow();
    });
  });
});
