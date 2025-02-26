import { ObjectId } from 'mongoose';

export interface JwtPayload {
  id: ObjectId;
  username: string;
  name: string;
  description: string;
  birthdate: string;
  gender: string;
  email: string;
  sub: string; // 'sub' is the user identifier
}
