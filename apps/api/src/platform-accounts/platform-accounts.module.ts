import { Module } from '@nestjs/common';
import { PlatformAccountsService } from './platform-accounts.service';
import { PlatformAccountsController } from './platform-accounts.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [PlatformAccountsService],
  controllers: [PlatformAccountsController],
})
export class PlatformAccountsModule {}