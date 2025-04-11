import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { hashedPassword } from '../helper/bcrypt';
import { compare } from 'bcrypt';
import { getUserByEmail } from '@/helpers/user.prisma';
import { IUser } from '@/interface/User.interface';
import { generateAuthToken } from '@/helper/token';

class AuthService {
  async register(req: Request) {
    const { email, password, first_name } = req.body;

    const existingUser = (await getUserByEmail(email)) as IUser;

    if (existingUser) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Email ${email} is already registered`,
      };
    }

    const registeredUser = await prisma.users.create({
      data: {
        first_name,
        email,
        password: await hashedPassword(password),
        is_verified: true,
        verification_link: 'abc', 
      },
    });

    let feedback: serviceFeedback;

    if (!registeredUser) {
      feedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Failed to register user with email ${email}`,
      };
    }

    feedback = {
      code: 200,
      data: registeredUser,
      status: statusEnum.SUCCESS,
      message: `Successfully registered user with email ${email}`,
    };
    return feedback;
  }

  async login(req: Request) {
    const { email, password } = req.body;

    if (!email || !password) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Email and password are required',
      };
    }

    try {
      const existingUser = (await getUserByEmail(email)) as IUser;

      if (!existingUser) {
        return {
          code: 401,
          data: null,
          status: statusEnum.FAILED,
          message: `The email that you've entered is incorrect.`,
        };
      }

      if (
        !existingUser.password ||
        !(await compare(password, existingUser.password))
      ) {
        return {
          code: 401,
          data: null,
          status: statusEnum.FAILED,
          message: `The password that you've entered is incorrect.`,
        };
      }

      const token = await generateAuthToken(existingUser);

      return {
        code: 200,
        data: token,
        status: statusEnum.SUCCESS,
        message: `Successfully logged user with email ${email} in.`,
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        status: statusEnum.FAILED,
        message: `Login failed`,
      };
    }
  }

  async getList(req: Request) {
    const { email } = req.query;
    const getListUsers = await prisma.users.findMany({
      where: {
        email: {
          contains: String(email || ''),
        },
      },
    });
    let feedback: serviceFeedback;
    feedback = {
      code: 200,
      data: getListUsers,
      status: statusEnum.SUCCESS,
      message: `Fetching all users`,
    };
    return feedback;
  }

  // async refreshToken(req: Request) {
  //   if (!req.user?.email)
  //     return {
  //       code: 401,
  //       data: null,
  //       status: statusEnum.FAILED,
  //       message: 'invalid token',
  //     };
  //   const refreshToken = await generateAuthToken(undefined, req.user?.email);
  //   return refreshToken;
  // }
}

export default new AuthService();
