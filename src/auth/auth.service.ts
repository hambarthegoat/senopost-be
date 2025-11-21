import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import type { AuthDto, TokenResponse } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService) {}

  private users: { email: string; password: string }[] = [];

  async register(dto: AuthDto): Promise<{ message: string }> {
    const hashed = await bcrypt.hash(dto.password, 10);

    this.users.push({
      email: dto.email,
      password: hashed,
    });

    return { message: 'User registered' };
  }

  async login(dto: AuthDto): Promise<TokenResponse> {
    const user = this.users.find(u => u.email === dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid password');

    const token = await this.jwt.signAsync({
      email: user.email,
    });

    return { access_token: token };
  }
}
