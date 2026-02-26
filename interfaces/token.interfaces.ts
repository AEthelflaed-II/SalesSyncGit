import { JwtPayload } from 'jsonwebtoken';
import { User } from '@prisma/client';

export type AccessTokenData = JwtPayload & {
  user: Omit<User, 'password' | 'createdAt' | 'updatedAt'>;
};

export type RefreshTokenData = JwtPayload;
