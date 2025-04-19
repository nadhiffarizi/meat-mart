import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { Request } from 'express';
import { hashedPassword } from '../helper/bcrypt';
import { compare } from 'bcrypt';
import { getUserByEmail, sendVerificationEmail } from '@/helpers/user.prisma';
import { IUser } from '@/interface/User.interface';
import { generateAuthToken } from '@/helper/token';
import { v4 as uuidv4 } from 'uuid';
import { addHours, isAfter } from 'date-fns';

class AuthService {
  async register(req: Request) {
    const {
      email,
      // password }
    } = req.body;

    const existingUser = (await getUserByEmail(email)) as IUser;

    if (existingUser) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Email ${email} is already registered`,
      };
    }
    const verificationToken = uuidv4();
    const tokenExpiry = new Date(Date.now() + 3600000);

    const registeredUser = await prisma.users.create({
      data: {
        email,
        // password: await hashedPassword(password),
        password: await hashedPassword('ratihjulistina'),
        is_verified: false,
        verification_link: verificationToken,
        verification_expiry: tokenExpiry,
      },
    });
    await sendVerificationEmail(email, verificationToken);

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
      message: `Verification email sent to ${email}`,
    };
    return feedback;
  }

  async login(req: Request) {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Aku lagi dicek dulu');
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Email and password are required',
      };
    }

    const existingUser = (await getUserByEmail(email)) as IUser;

    if (!existingUser) {
      return {
        code: 401,
        data: null,
        status: statusEnum.FAILED,
        message: `The email that you've entered is incorrect.`,
      };
    }

    if (!existingUser.is_verified) {
      const verificationToken = uuidv4();
      const tokenExpiry = new Date(Date.now() + 3600000);

      await sendVerificationEmail(email, verificationToken);
      await prisma.users.update({
        where: { email },
        data: {
          verification_link: verificationToken,
          verification_expiry: tokenExpiry,
        },
      });
      return {
        code: 403,
        data: null,
        status: statusEnum.FAILED,
        message: `The email that you've entered is not verified. Please, check your email`,
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

  async refreshToken(req: Request) {
    if (!req.user?.email) throw new Error('invalid token');
    const refreshToken = await generateAuthToken(undefined, req.user?.email);

    let feedback: serviceFeedback;
    feedback = {
      code: 200,
      data: refreshToken,
      status: statusEnum.SUCCESS,
      message: `Fetching all users`,
    };
    return feedback;
  }

  async verifyEmailToken(req: Request) {
    const { token, password } = req.body;
    const user = await prisma.users.findUnique({
      where: { verification_link: token },
    });

    if (!user) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Invalid verification token',
      };
    }

    if (user.is_verified) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Email already verified',
      };
    }

    if (
      user.verification_expiry &&
      isAfter(new Date(), user.verification_expiry)
    ) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Verification link has expired',
      };
    }

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        password: await hashedPassword(password),
        is_verified: true,
        verification_link: null,
        verification_expiry: null,
      },
    });

    return {
      code: 200,
      data: { email: updatedUser.email },
      status: statusEnum.SUCCESS,
      message: 'Email successfully verified',
    };
  }

  async resendVerificationEmail(req: Request) {
    const { email } = req.body;
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: 'User not found',
      };
    }

    if (user.is_verified) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Email is already verified',
      };
    }

    const verificationToken = uuidv4();
    const tokenExpiry = new Date(Date.now() + 3600000);

    await prisma.users.update({
      where: { email },
      data: {
        verification_link: verificationToken,
        verification_expiry: tokenExpiry,
      },
    });

    await sendVerificationEmail(email, verificationToken);

    return {
      code: 200,
      data: null,
      status: statusEnum.SUCCESS,
      message: 'Verification email resent successfully',
    };
  }
}

export default new AuthService();
