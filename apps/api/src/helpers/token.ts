/** @format */

import { jwtAccessSecret, jwtRefreshSecret } from '../config';
import { sign } from 'jsonwebtoken';
import { IUser } from '../interface/User.interface';
import { getUserByEmail } from '../helpers/user.prisma';
import { ErrorHandler } from '../helpers/responseHandler.helper';

export const generateAuthToken = async (user?: IUser, email?: string) => {
  const existingUser = user || ((await getUserByEmail(email!)) as IUser);
  if (!existingUser) throw new ErrorHandler('User not found', 401);

  if (existingUser.password) {
    delete existingUser.password;
  }

  const tokenPayload = {
    id: existingUser.id,
    email: existingUser.email,
    first_name: existingUser.first_name,
    last_name: existingUser.last_name,
    image_url: existingUser.image_url,
    role: existingUser.role,
    is_verified: existingUser.is_verified,
    provider: existingUser.provider || 'credentials',
  };

  const access_token = sign(tokenPayload, jwtAccessSecret, {
    expiresIn: '30m',
  });
  const refresh_token = sign(
    {
      email: existingUser.email,
      provider: existingUser.provider,
      role: existingUser.role,
    },
    jwtRefreshSecret,
    {
      expiresIn: '1h',
    },
  );
  return { access_token, refresh_token, user: tokenPayload };
};
