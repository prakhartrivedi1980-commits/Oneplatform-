import { Test, TestingModule } from '@nestjs/testing';
import { PlatformAccountsService } from './platform-accounts.service';
import { DatabaseService, PlatformAccount, Platform } from '@oneplatform/database';
import { CodeforcesAdapter } from '../platforms/codeforces/codeforces.adapter';
import { AdapterError, AdapterErrorCode } from '../platforms/errors/adapter-error.interface';
import { ConflictException, NotFoundException, GatewayTimeoutException, ServiceUnavailableException, BadGatewayException } from '@nestjs/common';

const mockDatabaseService = {
  platformAccount: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
};

const mockCodeforcesAdapter = {
  verifyAccount: jest.fn(),
};

const mockUserId = 'user-123';

const mockPlatformAccount: PlatformAccount = {
  id: 'account-123',
  userId: mockUserId,
  platform: Platform.LEETCODE,
  platformUsername: 'testuser',
  externalId: null,
  profileUrl: null,
  syncStatus: 'PENDING' as const,
  lastSyncedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockCodeforcesProfile = {
  platform: Platform.CODEFORCES,
  username: 'testuser',
  externalId: 'testuser',
  profileUrl: 'https://codeforces.com/profile/testuser',
};

describe('PlatformAccountsService', () => {
  let service: PlatformAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatformAccountsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: CodeforcesAdapter,
          useValue: mockCodeforcesAdapter,
        },
      ],
    }).compile();

    service = module.get<PlatformAccountsService>(PlatformAccountsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPlatformAccount', () => {
    it('should create a new platform account', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(null);
      mockDatabaseService.platformAccount.create.mockResolvedValue(mockPlatformAccount);

      await service.createPlatformAccount(mockUserId, {
        platform: Platform.LEETCODE,
        username: 'testuser',
      });

      expect(mockDatabaseService.platformAccount.findFirst).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          platform: Platform.LEETCODE,
          platformUsername: 'testuser',
        },
      });
      expect(mockDatabaseService.platformAccount.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          platform: Platform.LEETCODE,
          platformUsername: 'testuser',
          externalId: undefined,
          profileUrl: undefined,
          syncStatus: 'PENDING',
          lastSyncedAt: undefined,
        },
      });
    });

    it('should verify Codeforces account before creation', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(null);
      mockCodeforcesAdapter.verifyAccount.mockResolvedValue(mockCodeforcesProfile);
      mockDatabaseService.platformAccount.create.mockResolvedValue({
        ...mockPlatformAccount,
        platform: Platform.CODEFORCES,
        platformUsername: 'testuser',
        externalId: 'testuser',
        profileUrl: 'https://codeforces.com/profile/testuser',
        syncStatus: 'SUCCESS' as const,
        lastSyncedAt: expect.any(Date),
      });

      await service.createPlatformAccount(mockUserId, {
        platform: Platform.CODEFORCES,
        username: 'testuser',
      });


      expect(mockCodeforcesAdapter.verifyAccount).toHaveBeenCalledWith('testuser');
      expect(mockDatabaseService.platformAccount.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          platform: Platform.CODEFORCES,
          platformUsername: 'testuser',
          externalId: 'testuser',
          profileUrl: 'https://codeforces.com/profile/testuser',
          syncStatus: 'SUCCESS',
          lastSyncedAt: expect.any(Date),
        },
      });
    });

    it('should throw ConflictException for duplicate account', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(mockPlatformAccount);

      await expect(
        service.createPlatformAccount(mockUserId, {
          platform: Platform.LEETCODE,
          username: 'testuser',
        }),
      ).rejects.toThrow(new ConflictException('Platform account already exists'));
    });

    it('should throw NotFoundException for invalid Codeforces account', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(null);
      mockCodeforcesAdapter.verifyAccount.mockRejectedValue(
        new AdapterError({
          code: AdapterErrorCode.USER_NOT_FOUND,
          message: 'Codeforces account not found',
          isRetryable: false,
          isSafeToExpose: true,
        }),
      );

      await expect(
        service.createPlatformAccount(mockUserId, {
          platform: Platform.CODEFORCES,
          username: 'nonexistent',
        }),
      ).rejects.toThrow(new NotFoundException('Codeforces account not found'));
    });

    it('should throw GatewayTimeoutException for timeout', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(null);
      mockCodeforcesAdapter.verifyAccount.mockRejectedValue(
        new AdapterError({
          code: AdapterErrorCode.TIMEOUT,
          message: 'Request timed out',
          isRetryable: true,
          isSafeToExpose: true,
        }),
      );

      await expect(
        service.createPlatformAccount(mockUserId, {
          platform: Platform.CODEFORCES,
          username: 'testuser',
        }),
      ).rejects.toThrow(new GatewayTimeoutException('Request timed out'));
    });

    it('should throw ServiceUnavailableException for network error', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(null);
      mockCodeforcesAdapter.verifyAccount.mockRejectedValue(
        new AdapterError({
          code: AdapterErrorCode.NETWORK_ERROR,
          message: 'Network error',
          isRetryable: true,
          isSafeToExpose: false,
        }),
      );

      await expect(
        service.createPlatformAccount(mockUserId, {
          platform: Platform.CODEFORCES,
          username: 'testuser',
        }),
      ).rejects.toThrow(new ServiceUnavailableException('Network error'));
    });

    it('should throw BadGatewayException for invalid response', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(null);
      mockCodeforcesAdapter.verifyAccount.mockRejectedValue(
        new AdapterError({
          code: AdapterErrorCode.INVALID_RESPONSE,
          message: 'Invalid response',
          isRetryable: false,
          isSafeToExpose: false,
        }),
      );

      await expect(
        service.createPlatformAccount(mockUserId, {
          platform: Platform.CODEFORCES,
          username: 'testuser',
        }),
      ).rejects.toThrow(new BadGatewayException('Invalid response'));
    });

    it('should throw ServiceUnavailableException for rate limited', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(null);
      mockCodeforcesAdapter.verifyAccount.mockRejectedValue(
        new AdapterError({
          code: AdapterErrorCode.RATE_LIMITED,
          message: 'Rate limited',
          isRetryable: true,
          isSafeToExpose: true,
        }),
      );

      await expect(
        service.createPlatformAccount(mockUserId, {
          platform: Platform.CODEFORCES,
          username: 'testuser',
        }),
      ).rejects.toThrow(new ServiceUnavailableException('Rate limited'));
    });
  });
});
