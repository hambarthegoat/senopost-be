import { Controller, Post, Param, Body, UseGuards, Request } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VoteDto } from './dto/vote.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
export class VotesController {
  constructor(private svc: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('posts/:id/votes')
  votePost(@Param('id') id: string, @Body() dto: VoteDto, @Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.svc.votePost(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('comments/:id/votes')
  voteComment(@Param('id') id: string, @Body() dto: VoteDto, @Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    return this.svc.voteComment(id, userId, dto);
  }
}
