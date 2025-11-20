import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED || '1h',
}));
