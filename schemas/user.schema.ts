import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  birthdate: string;

  @Prop({ required: true, enum: ['MALE', 'FEMALE', 'OTHER'] })
  gender: string;

  @Prop()
  description: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
