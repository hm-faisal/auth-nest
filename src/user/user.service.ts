import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(id).exec();
      return user;
    } catch (_error) {
      throw new Error('User not found');
    }
  }

  async findUser(email: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email: email });
      return user;
    } catch (e) {
      throw new Error('User not found');
    }
  }

  async updateOne(id: string, data: User): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, { ...data }, { new: true });
  }
}
