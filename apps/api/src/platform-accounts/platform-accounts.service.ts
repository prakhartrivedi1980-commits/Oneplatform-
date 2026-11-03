import { Injectable, ConflictException, NotFoundException, Inject, BadGatewayException, GatewayTimeoutException, ServiceUnavailableException } from '@nestjs/common';
import { DatabaseService, Platform } from '@oneplatform/database';
import { CodeforcesAdapter } from '../platforms/codeforces/codeforces.adapter';
import { AdapterError, AdapterErrorCode } from '../platforms/errors/adapter-error.interface';
import { PlatformAccountResponseDto } from './dto/platform-account-response.dto';

interface CreatePlatformAccountDto {
  platform: Platform;
  username: string;
}

@Injectable()
export class PlatformAccountsService {
  constructor(
  @Inject(DatabaseService)
  private readonly database: DatabaseService,
  @Inject(CodeforcesAdapter)
  private readonly codeforcesAdapter: CodeforcesAdapter,
) {}

  async createPlatformAccount(
    userId: string,
    createPlatformAccountDto: CreatePlatformAccountDto,
  ): Promise<PlatformAccountResponseDto> {
    // Check for existing account with same platform and username
    const existingAccount = await this.database.platformAccount.findFirst({
      where: {
        userId,
        platform: createPlatformAccountDto.platform,
        platformUsername: createPlatformAccountDto.username,
      },
    });

    if (existingAccount) {
      throw new ConflictException('Platform account already exists');
    }

    let verifiedUsername = createPlatformAccountDto.username;
    let externalId: string | undefined = undefined;
    let profileUrl: string | undefined = undefined;
    let syncStatus: 'SUCCESS' | 'PENDING' = 'PENDING';
    let lastSyncedAt: Date | undefined = undefined;

    // Handle Codeforces-specific account verification
    if (createPlatformAccountDto.platform === Platform.CODEFORCES) {
      try {
        const profile = await this.codeforcesAdapter.verifyAccount(createPlatformAccountDto.username);
        verifiedUsername = profile.username;
        externalId = profile.externalId;
        profileUrl = profile.profileUrl;
        syncStatus = 'SUCCESS';
        lastSyncedAt = new Date();
      } catch (error) {
        if (error instanceof AdapterError) {
          if (error.code === AdapterErrorCode.USER_NOT_FOUND) {
            throw new NotFoundException('Codeforces account not found');
          }
          switch (error.code) {
            case AdapterErrorCode.TIMEOUT:
              throw new GatewayTimeoutException(error.message);
            case AdapterErrorCode.NETWORK_ERROR:
            case AdapterErrorCode.UPSTREAM_UNAVAILABLE:
              throw new ServiceUnavailableException(error.message);
            case AdapterErrorCode.INVALID_RESPONSE:
              throw new BadGatewayException(error.message);
            case AdapterErrorCode.RATE_LIMITED:
              throw new ServiceUnavailableException(error.message);
            default:
              throw new ConflictException(error.message);
          }
        }
        throw error;
      }
    }

    // Create new platform account
    const account = await this.database.platformAccount.create({
      data: {
        userId,
        platform: createPlatformAccountDto.platform,
        platformUsername: verifiedUsername,
        externalId,
        profileUrl,
        syncStatus,
        lastSyncedAt,
      },
    });

    return {
      id: account.id,
      platform: account.platform,
      username: account.platformUsername,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

  async findAllPlatformAccounts(userId: string): Promise<PlatformAccountResponseDto[]> {
    const accounts = await this.database.platformAccount.findMany({
      where: {
        userId,
      },
    });

    return accounts.map(account => ({
      id: account.id,
      platform: account.platform,
      username: account.platformUsername,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    }));
  }

  async removePlatformAccount(userId: string, id: string): Promise<PlatformAccountResponseDto> {
    // Verify the account belongs to the user
    const account = await this.database.platformAccount.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!account) {
      throw new NotFoundException('Platform account not found');
    }

    const deletedAccount = await this.database.platformAccount.delete({
      where: {
        id,
      },
    });

    return {
      id: deletedAccount.id,
      platform: deletedAccount.platform,
      username: deletedAccount.platformUsername,
      createdAt: deletedAccount.createdAt,
      updatedAt: deletedAccount.updatedAt,
    };
  }
}