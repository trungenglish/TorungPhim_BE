import { UserRole } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  role?: UserRole;
  iss?: string;
  aud?: string;
  iat?: number;
  exp?: number;
}
