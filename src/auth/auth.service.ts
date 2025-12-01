import { Injectable, UnauthorizedException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  async register(dto: AuthDto) {
    try {
      if (!dto.email || !dto.password) {
        throw new BadRequestException('Email and password are required');
      }

      if (dto.password.length < 6) {
        throw new BadRequestException('Password must be at least 6 characters long');
      }

      const hashed = await bcrypt.hash(dto.password, 10);
      const user = await this.prisma.user.create({ data: { email: dto.email, password: hashed } });
      return { id: user.id, email: user.email };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
      if (error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(dto: AuthDto) {
    try {
      if (!dto.email || !dto.password) {
        throw new BadRequestException('Email and password are required');
      }

      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user || !user.password) throw new UnauthorizedException('Invalid credentials');

      const match = await bcrypt.compare(dto.password, user.password);
      if (!match) throw new UnauthorizedException('Invalid credentials');

      const token = await this.jwt.signAsync({ sub: user.id, email: user.email });
      return { token, user_id: user.id };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async validateUserById(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('User ID is required');
      }
      return this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to validate user');
    }
  }
}
