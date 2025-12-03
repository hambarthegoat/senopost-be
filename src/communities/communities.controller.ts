import { Controller, Post, Body, UseGuards, Request, Get, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('communities')
export class CommunitiesController {
  constructor(private svc: CommunitiesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.svc.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCommunityDto, @Request() req: any) {
    return this.svc.create(dto, req.user?.sub || req.user?.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Get(':id/posts')
  @HttpCode(HttpStatus.OK)
  async posts(@Param('id') id: string) {
    return this.svc.postsForCommunity(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() dto: UpdateCommunityDto) {
    return this.svc.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any) {
    const userId = req.user?.sub || req.user?.id;
    await this.svc.remove(id, userId);
  }
}
