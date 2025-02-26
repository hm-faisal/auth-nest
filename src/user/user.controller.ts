import { Controller, Get, Body, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() data: User,
  ): Promise<User | null> {
    return this.userService.updateOne(id, data);
  }
}
