import { Controller, Post, Body, UseGuards, Request, Param, Get, Patch, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
export class CommentsController {
  constructor(private svc: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('posts/:pid/comments')
  create(@Param('pid') pid: string, @Body() dto: CreateCommentDto, @Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.svc.create(pid, dto, userId);
  }

  @Get('posts/:pid/comments')
  findByPost(@Param('pid') pid: string) {
    return this.svc.findByPost(pid);
  }

  @Patch('comments/:id')
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.svc.update(id, dto);
  }

  @Delete('comments/:id')
  async remove(@Param('id') id: string) {
    await this.svc.remove(id);
    return { statusCode: 204 };
  }
}
