import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  validate(payload: JwtPayload) {
    const { sub, email, username, avatarUrl, role, iss, aud, exp, iat } =
      payload;
    return {
      userId: sub,
      email: email,
      username: username,
      avatarUrl: avatarUrl,
      role: role,
      iss: iss,
      aud: aud,
      exp: exp,
      iat: iat,
    };
  }
}
