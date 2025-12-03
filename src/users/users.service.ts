import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('User ID is required');
      }

      const user = await this.prisma.user.findUnique({ where: { id }, select: { id: true, email: true, username: true, photo: true } });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
      if (!id) {
        throw new BadRequestException('User ID is required');
      }

      const data: any = {};
      if (dto.email) data.email = dto.email;
      if (dto.password) data.password = await bcrypt.hash(dto.password, 10);
      if (dto.username !== undefined) data.username = dto.username;
      if (dto.photo !== undefined) data.photo = dto.photo;

      const user = await this.prisma.user.update({ where: { id }, data, select: { id: true, email: true, username: true, photo: true } });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('User ID is required');
      }

      await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User not found');
        }
      }
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
