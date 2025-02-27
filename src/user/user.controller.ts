import { Controller, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../schemas/user.schema';
import { JwtAuthGuard } from '../guards/authguard';

@Controller('users/profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':username')
  async updateOne(
    @Param('username') id: string,
    @Body() data: User,
  ): Promise<User | null> {
    return this.userService.updateOne(id, data);
  }
}
