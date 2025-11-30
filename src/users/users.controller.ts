import { Controller, Get, Param, Patch, Delete, UseGuards, Req, Body, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller()
export class UsersController {
  constructor(private users: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request & { user?: any }) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Not authenticated');
    return this.users.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@Req() req: Request & { user?: any }, @Body() dto: UpdateUserDto) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Not authenticated');
    return this.users.update(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async removeMe(@Req() req: Request & { user?: any }) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('Not authenticated');
    await this.users.remove(userId);
    return { statusCode: 204 };
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }
}
