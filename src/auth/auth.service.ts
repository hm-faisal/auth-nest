import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const { password } = data;
    if (!password) {
      throw new BadRequestException('Invalid Credentials');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = new this.userModel({ ...data, password: hashPassword });
    return newUser.save();
  }

  async loginUser(userData: {
    username: string;
    password: string;
  }): Promise<LoginResponseDto> {
    const { username, password } = userData;
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new BadRequestException('Invalid User');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    const payload: JwtPayload = { username: user.username, sub: user.email };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('SECRET_KEY'),
      }),
    };
  }
}
