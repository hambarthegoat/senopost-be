import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.auth.login(dto);
  }

  // placeholder oauth endpoints - return redirect url then callback
  @Get('oauth/:provider')
  oauth(@Param('provider') provider: string) {
    return { redirect_url: `https://oauth.example/${provider}` };
  }

  @Get('oauth/:provider/callback')
  oauthCallback(@Param('provider') provider: string, @Query('code') code: string) {
    // OAuth not implemented yet; return 501-like response shape
    return { token: null, user_id: null, note: 'OAuth not implemented yet' };
  }

  @Post('logout')
  logout() {
    return { success: true };
  }
}
