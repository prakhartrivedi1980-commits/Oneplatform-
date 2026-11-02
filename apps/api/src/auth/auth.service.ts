import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private readonly supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and publishable key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async verifyToken(token: string): Promise<User> {
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error) {
      throw new Error('Invalid token');
    }

    if (!data.user) {
      throw new Error('Invalid token');
    }

    return data.user;
  }
}