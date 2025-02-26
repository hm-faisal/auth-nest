import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('SECRET_KEY'), // Get the secret key from .env
    });
  }

  async validate(payload: JwtPayload) {
    // You can add user validation logic here (e.g., lookup the user in DB)
    return { userId: payload.sub, username: payload.username };
  }
}
