import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { DatabaseModule } from '../database/database.module.js';
import { UserSyncService } from './user-sync.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [AuthService, AuthGuard, UserSyncService],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, UserSyncService],
})
export class AuthModule {}