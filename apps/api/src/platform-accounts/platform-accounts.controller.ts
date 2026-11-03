import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Platform } from '@oneplatform/database';

import { AuthGuard } from '../auth/auth.guard';
import { PlatformAccountResponseDto } from './dto/platform-account-response.dto';
import { PlatformAccountsService } from './platform-accounts.service';

interface CreatePlatformAccountDto {
  platform: Platform;
  username: string;
}

@Controller('platform-accounts')
export class PlatformAccountsController {
  constructor(
    @Inject(PlatformAccountsService)
    private readonly platformAccountsService: PlatformAccountsService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Request() req: { user: { id: string } },
    @Body() createPlatformAccountDto: CreatePlatformAccountDto,
  ): Promise<PlatformAccountResponseDto> {
    return this.platformAccountsService.createPlatformAccount(
      req.user.id,
      createPlatformAccountDto,
    );
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(
    @Request() req: { user: { id: string } },
  ): Promise<PlatformAccountResponseDto[]> {
    return this.platformAccountsService.findAllPlatformAccounts(req.user.id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
  ): Promise<PlatformAccountResponseDto> {
    return this.platformAccountsService.removePlatformAccount(req.user.id, id);
  }
}