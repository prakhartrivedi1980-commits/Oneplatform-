import { Test, TestingModule } from '@nestjs/testing';
import { UserSyncService } from './user-sync.service';
import { DatabaseService, User as PrismaUser } from '@oneplatform/database';
import { User } from '@supabase/supabase-js';

const mockDatabaseService = {
  user: {
    upsert: jest.fn(),
  },
};

const mockSupabaseUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
  app_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
};

const mockExistingUser: PrismaUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  username: null,
  avatarUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('UserSyncService', () => {
  let service: UserSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSyncService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<UserSyncService>(UserSyncService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('syncUser', () => {
    it('should create a new user when one does not exist', async () => {
      mockDatabaseService.user.upsert.mockResolvedValue(mockExistingUser);

      const result = await service.syncUser(mockSupabaseUser);

      expect(mockDatabaseService.user.upsert).toHaveBeenCalledWith({
        where: { id: mockSupabaseUser.id },
        create: {
          id: mockSupabaseUser.id,
          email: mockSupabaseUser.email ?? '',
          displayName: mockSupabaseUser.user_metadata?.full_name ?? null,
        },
        update: {
          email: mockSupabaseUser.email ?? '',
          displayName: mockSupabaseUser.user_metadata?.full_name ?? null,
        },
      });
      expect(result).toEqual(mockExistingUser);
    });

    it('should return an existing user when one exists', async () => {
      mockDatabaseService.user.upsert.mockResolvedValue(mockExistingUser);

      const result = await service.syncUser(mockSupabaseUser);

      expect(mockDatabaseService.user.upsert).toHaveBeenCalledWith({
        where: { id: mockSupabaseUser.id },
        create: {
          id: mockSupabaseUser.id,
          email: mockSupabaseUser.email ?? '',
          displayName: mockSupabaseUser.user_metadata?.full_name ?? null,
        },
        update: {
          email: mockSupabaseUser.email ?? '',
          displayName: mockSupabaseUser.user_metadata?.full_name ?? null,
        },
      });
      expect(result).toEqual(mockExistingUser);
    });

    it('should not create a duplicate user on repeated synchronization', async () => {
      mockDatabaseService.user.upsert.mockResolvedValue(mockExistingUser);

      // First call
      await service.syncUser(mockSupabaseUser);
      // Second call
      const result = await service.syncUser(mockSupabaseUser);

      expect(mockDatabaseService.user.upsert).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockExistingUser);
    });

    it('should update profile information when it changes', async () => {
      const updatedSupabaseUser: User = {
        ...mockSupabaseUser,
        email: 'updated@example.com',
        user_metadata: {
          full_name: 'Updated User',
        },
      };

      const updatedUser: PrismaUser = {
        ...mockExistingUser,
        email: 'updated@example.com',
        displayName: 'Updated User',
      };

      mockDatabaseService.user.upsert.mockResolvedValue(updatedUser);

      const result = await service.syncUser(updatedSupabaseUser);

      expect(mockDatabaseService.user.upsert).toHaveBeenCalledWith({
        where: { id: updatedSupabaseUser.id },
        create: {
          id: updatedSupabaseUser.id,
          email: updatedSupabaseUser.email ?? '',
          displayName: updatedSupabaseUser.user_metadata?.full_name ?? null,
        },
        update: {
          email: updatedSupabaseUser.email ?? '',
          displayName: updatedSupabaseUser.user_metadata?.full_name ?? null,
        },
      });
      expect(result).toEqual(updatedUser);
    });
  });
});