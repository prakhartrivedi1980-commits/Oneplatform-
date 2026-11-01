import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() req: { user: any }) {
    return {
      id: req.user.id,
      email: req.user.email,
      name: req.user.user_metadata?.full_name,
    };
  }
}