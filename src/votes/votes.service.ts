import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VoteDto } from './dto/vote.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VotesService {
  constructor(private prisma: PrismaService) {}

  private async upsertVote(userId: string, targetId: string, targetType: 'post' | 'comment', value: number) {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      if (!targetId) {
        throw new BadRequestException('Target ID is required');
      }

      if (value !== 1 && value !== -1) {
        throw new BadRequestException('Vote value must be 1 or -1');
      }

      const existing = await this.prisma.vote.findUnique({ where: { userId_targetId_targetType: { userId, targetId, targetType } } as any });

      if (!existing) {
        await this.prisma.vote.create({ data: { userId, targetId, targetType, value } });
      } else {
        await this.prisma.vote.update({ where: { userId_targetId_targetType: { userId, targetId, targetType } } as any, data: { value } });
      }

      const agg = await this.prisma.vote.aggregate({ where: { targetId, targetType }, _sum: { value: true } });
      const score = agg._sum.value ?? 0;

      if (targetType === 'post') {
        await this.prisma.post.update({ where: { id: targetId }, data: { score } });
        return { post_id: targetId, score };
      }

      await this.prisma.comment.update({ where: { id: targetId }, data: { score } });
      return { comment_id: targetId, score };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(`${targetType === 'post' ? 'Post' : 'Comment'} or user not found`);
        }
        if (error.code === 'P2025') {
          throw new NotFoundException(`${targetType === 'post' ? 'Post' : 'Comment'} not found`);
        }
      }
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to process vote');
    }
  }

  async votePost(postId: string, userId: string, dto: VoteDto) {
    try {
      return this.upsertVote(userId, postId, 'post', dto.value);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to vote on post');
    }
  }

  async voteComment(commentId: string, userId: string, dto: VoteDto) {
    try {
      return this.upsertVote(userId, commentId, 'comment', dto.value);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to vote on comment');
    }
  }
}
