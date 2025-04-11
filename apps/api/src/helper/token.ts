/** @format */

import { jwtAccessSecret, jwtRefreshSecret } from '../config';
import { sign } from 'jsonwebtoken';
import { IUser } from '../interface/User.interface';
import { getUserByEmail } from '../helpers/user.prisma';
import { ErrorHandler } from './responseHandler.helper';

export const generateAuthToken = async (user?: IUser, email?: string) => {
  const existingUser = user || ((await getUserByEmail(email!)) as IUser);
  if (!existingUser) throw new ErrorHandler('wrong email', 401);
  delete existingUser.password;

  const access_token = sign(existingUser, jwtAccessSecret, {
    expiresIn: '30m',
  });
  const refresh_token = sign({ email: existingUser.email }, jwtRefreshSecret, {
    expiresIn: '1h',
  });
  return { access_token, refresh_token };
};
