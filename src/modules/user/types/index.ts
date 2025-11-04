import { Prisma } from '@prisma/client';

export type UserWithAuthProviders = Prisma.UserGetPayload<{
  include: { AuthProvider: true };
}>;
