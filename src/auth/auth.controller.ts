import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthDto, TokenResponse } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto): Promise<{ message: string }> {
    return this.auth.register(dto);
  }

  @Post('login')
  login(@Body() dto: AuthDto): Promise<TokenResponse> {
    return this.auth.login(dto);
  }
}
