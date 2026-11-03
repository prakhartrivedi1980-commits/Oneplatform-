import { Module } from '@nestjs/common';
import { PlatformAccountsService } from './platform-accounts.service';
import { PlatformAccountsController } from './platform-accounts.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { CodeforcesAdapter } from '../platforms/codeforces/codeforces.adapter';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [PlatformAccountsService, CodeforcesAdapter],
  controllers: [PlatformAccountsController],
})
export class PlatformAccountsModule {}