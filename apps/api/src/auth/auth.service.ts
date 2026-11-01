import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and publishable key must be provided');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async verifyToken(token: string): Promise<{ id: string; email: string; user_metadata?: { full_name?: string } }> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser(token);

      if (error) {
        throw new Error(error.message);
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}