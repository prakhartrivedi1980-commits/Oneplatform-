import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './auth.guard.js';
import { User } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() req: { user: User }) {
    return req.user;
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.user_metadata?.full_name,
    };
  }
}