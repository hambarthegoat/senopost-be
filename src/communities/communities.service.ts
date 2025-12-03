import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommunitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      return this.prisma.community.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch communities');
    }
  }

  async create(dto: CreateCommunityDto, creatorId: string) {
    try {
      if (!dto.name) {
        throw new BadRequestException('Community name is required');
      }

      if (!creatorId) {
        throw new BadRequestException('Creator ID is required');
      }

      const community = await this.prisma.community.create({
        data: {
          name: dto.name,
          description: dto.description,
          creatorId,
        },
      });
      return community;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Community name already exists');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Creator user not found');
        }
      }
      if (error instanceof BadRequestException || error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create community');
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('Community ID is required');
      }

      const community = await this.prisma.community.findUnique({ where: { id } });
      if (!community) throw new NotFoundException('Community not found');
      return community;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch community');
    }
  }

  async update(id: string, dto: UpdateCommunityDto) {
    try {
      if (!id) {
        throw new BadRequestException('Community ID is required');
      }

      return this.prisma.community.update({ where: { id }, data: { description: dto.description } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Community not found');
        }
      }
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update community');
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException('Community ID is required');
      }

      await this.prisma.community.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Community not found');
        }
      }
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete community');
    }
  }

  async postsForCommunity(cid: string) {
    try {
      if (!cid) {
        throw new BadRequestException('Community ID is required');
      }

      return this.prisma.post.findMany({ where: { communityId: cid }, select: { id: true, title: true, score: true } });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch community posts');
    }
  }
}
