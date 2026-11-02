import { Module } from '@nestjs/common';
import { DatabaseService } from '@oneplatform/database';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}