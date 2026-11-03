import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PlatformAccountsService } from './platform-accounts.service';
import { DatabaseService, PlatformAccount, Platform } from '@oneplatform/database';

const mockDatabaseService = {
  platformAccount: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
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

      const result = await service.createPlatformAccount(mockUserId, {
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
        },
      });
      expect(result).toEqual({
        id: mockPlatformAccount.id,
        platform: mockPlatformAccount.platform,
        username: mockPlatformAccount.platformUsername,
        createdAt: mockPlatformAccount.createdAt,
        updatedAt: mockPlatformAccount.updatedAt,
      });

      // Verify internal fields are not exposed
      expect(result).not.toHaveProperty('userId');
      expect(result).not.toHaveProperty('platformUsername');
      expect(result).not.toHaveProperty('externalId');
      expect(result).not.toHaveProperty('profileUrl');
      expect(result).not.toHaveProperty('syncStatus');
      expect(result).not.toHaveProperty('lastSyncedAt');
      expect(result).not.toHaveProperty('accessToken');
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('should throw an error if account already exists', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(mockPlatformAccount);

      await expect(
        service.createPlatformAccount(mockUserId, {
          platform: Platform.LEETCODE,
          username: 'testuser',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAllPlatformAccounts', () => {
    it('should return all platform accounts for a user', async () => {
      mockDatabaseService.platformAccount.findMany.mockResolvedValue([mockPlatformAccount]);

      const result = await service.findAllPlatformAccounts(mockUserId);

      expect(mockDatabaseService.platformAccount.findMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
        },
        select: {
          id: true,
          platform: true,
          platformUsername: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const expectedResponse = {
        id: mockPlatformAccount.id,
        platform: mockPlatformAccount.platform,
        username: mockPlatformAccount.platformUsername,
        createdAt: mockPlatformAccount.createdAt,
        updatedAt: mockPlatformAccount.updatedAt,
      };
      expect(result).toEqual([expectedResponse]);
    });
  });

  describe('removePlatformAccount', () => {
    it('should remove a platform account if it belongs to the user', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(mockPlatformAccount);
      mockDatabaseService.platformAccount.delete.mockResolvedValue(mockPlatformAccount);

      const result = await service.removePlatformAccount(mockUserId, mockPlatformAccount.id);

      expect(mockDatabaseService.platformAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockPlatformAccount.id,
          userId: mockUserId,
        },
      });
      expect(mockDatabaseService.platformAccount.delete).toHaveBeenCalledWith({
        where: {
          id: mockPlatformAccount.id,
        },
      });
      expect(result).toEqual({
        id: mockPlatformAccount.id,
        platform: mockPlatformAccount.platform,
        username: mockPlatformAccount.platformUsername,
        createdAt: mockPlatformAccount.createdAt,
        updatedAt: mockPlatformAccount.updatedAt,
      });

      // Verify internal fields are not exposed
      expect(result).not.toHaveProperty('userId');
      expect(result).not.toHaveProperty('platformUsername');
      expect(result).not.toHaveProperty('externalId');
      expect(result).not.toHaveProperty('profileUrl');
      expect(result).not.toHaveProperty('syncStatus');
      expect(result).not.toHaveProperty('lastSyncedAt');
      expect(result).not.toHaveProperty('accessToken');
      expect(result).not.toHaveProperty('refreshToken');
    });

    it('should throw an error if account does not belong to the user', async () => {
      mockDatabaseService.platformAccount.findFirst.mockResolvedValue(null);

      await expect(
        service.removePlatformAccount(mockUserId, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
