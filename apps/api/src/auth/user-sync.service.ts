import { Injectable, Inject } from '@nestjs/common';
import { User } from '@supabase/supabase-js';
import { DatabaseService, User as PrismaUser } from '@oneplatform/database';

@Injectable()
export class UserSyncService {
  constructor(
    @Inject(DatabaseService)
    private readonly database: DatabaseService,
  ) {}

  async syncUser(supabaseUser: User): Promise<PrismaUser> {
    // Find or create the user in the database
    const user = await this.database.user.upsert({
      where: { id: supabaseUser.id },
      create: {
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        displayName: supabaseUser.user_metadata?.full_name ?? null,
      },
      update: {
        email: supabaseUser.email ?? '',
        displayName: supabaseUser.user_metadata?.full_name ?? null,
      },
    });

    return user;
  }
}