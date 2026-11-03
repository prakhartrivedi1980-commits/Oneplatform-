import { Injectable, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { DatabaseService, Platform } from '@oneplatform/database';
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

    // Create new platform account
    const account = await this.database.platformAccount.create({
      data: {
        userId,
        platform: createPlatformAccountDto.platform,
        platformUsername: createPlatformAccountDto.username,
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