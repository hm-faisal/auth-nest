import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { User } from '../../schemas/user.schema'; // Adjust the path accordingly
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async create(@Body() createUserDto: Partial<User>): Promise<User> {
    if (
      !createUserDto.name ||
      !createUserDto.username ||
      !createUserDto.email ||
      !createUserDto.password ||
      !createUserDto.birthdate ||
      !createUserDto.gender
    ) {
      throw new BadRequestException(
        'The request data is invalid or incomplete.',
      );
    }

    const user = await this.userService.findUser(createUserDto.email);
    if (user) {
      throw new BadRequestException('User Already Exist');
    }

    return this.authService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body() userInfo: { username: string; password: string },
  ): Promise<LoginResponseDto> {
    if (!userInfo.username || !userInfo.password) {
      throw new BadRequestException('Invalid Username or Password');
    }
    return this.authService.loginUser(userInfo);
  }

  @Get(':username')
  async me(@Param('username') username: string): Promise<Partial<User | null>> {
    if (!username) {
      throw new BadRequestException('Username Not found');
    }
    return this.authService.getUser(username);
  }
}
