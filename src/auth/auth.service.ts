import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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

  async getUser(username: string): Promise<Partial<User | null>> {
    const user = await this.userModel.findOne({ username: username });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async create(data: Partial<User>): Promise<LoginResponseDto> {
    const { password, username } = data;
    if (!password) {
      throw new BadRequestException('Invalid Credentials');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    const newUser = new this.userModel({
      ...data,
      password: hashPassword,
      username: username?.toLowerCase(),
    });
    const userData = await newUser.save();
    const payload: JwtPayload = {
      id: userData._id as ObjectId,
      username: userData.username,
      name: userData.name,
      description: userData.description,
      birthdate: userData.birthdate,
      gender: userData.gender,
      email: userData.email,
      sub: userData.email,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('SECRET_KEY'),
      }),
    };
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

    const payload: JwtPayload = {
      id: user._id as ObjectId,
      username: user.username,
      name: user.name,
      description: user.description,
      birthdate: user.birthdate,
      gender: user.gender,
      email: user.email,
      sub: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('SECRET_KEY'),
      }),
    };
  }
}
