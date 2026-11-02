import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './auth.guard.js';

@Controller('auth')
export class AuthController {
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() req: { user: { id: string; email: string; displayName: string | null; createdAt: Date } }) {
    const { id, email, displayName: name, createdAt } = req.user;
    return {
      id,
      email,
      name,
      createdAt,
    };
  }
}