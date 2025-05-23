import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { Request } from 'express';
import { compare } from 'bcrypt';
import {
  getUserByEmail,
  sendResetEmail,
  sendVerificationEmail,
} from '@/helper/user.prisma';
import { IUser } from '@/interface/User.interface';
import { generateAuthToken } from '@/helper/token';
import { v4 as uuidv4 } from 'uuid';
import { isAfter } from 'date-fns';
import { registerSocialUser } from '@/helper/auth';
import { hashedPassword } from '@/helper/bcrypt';
import { ErrorHandler } from '@/helper/responseHandler.helper';

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
        password: await hashedPassword('tes'),
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

    if (existingUser.provider !== 'credentials') {
      return {
        code: 403,
        data: null,
        status: statusEnum.FAILED,
        message: `The email that you've entered is social login email. Please, use social login button`,
      };
    }

    if (!existingUser.is_verified) {
      const verificationToken = uuidv4();
      const tokenExpiry = new Date(Date.now() + 3600000);

      await sendVerificationEmail(email, verificationToken);
      const updated = await prisma.users.update({
        where: { email },
        data: {
          verification_link: verificationToken,
          verification_expiry: tokenExpiry,
        },
      });
      console.log('MENGIRIM EMAIL VERIFIKASI LAGI', updated);
      return {
        code: 403,
        data: null,
        status: statusEnum.FAILED,
        message: `The email that you've entered is not verified. Please, check your email`,
      };
    }
    console.log(await compare(password, existingUser.password!));

    if (
      !existingUser.password ||
      !(await compare(password as string, existingUser.password))
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
    if (!req.user || !req.user.email) {
      throw new ErrorHandler('Invalid token', 401);
    }
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
    if (!token) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Invalid verification token',
      };
    }

    const user = await prisma.users.findUnique({
      where: { verification_link: token },
    });

    if (!user) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Invalid verification link',
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
      console.log('into verification link has expired');
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

    const verificationToken = uuidv4();
    const tokenExpiry = new Date(Date.now() + 3600000);
    console.log('Tanggal sekarang', Date.now());
    console.log('1 jam kemudian', tokenExpiry);

    await prisma.users.update({
      where: { email, is_verified: false },
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

  async resetPasswordEmail(req: Request) {
    const { email } = req.body;
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Email does not exist. Please, enter the correct email',
      };
    }
    if (user?.provider !== 'credentials') {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Social login cannot reset password',
      };
    }
    const resetToken = uuidv4();
    const tokenResetExpiry = new Date(Date.now() + 3600000);
    await prisma.users.update({
      where: { email },
      data: {
        verification_link: resetToken,
        verification_expiry: tokenResetExpiry,
      },
    });

    await sendResetEmail(email, resetToken);
    return {
      code: 200,
      data: null,
      status: statusEnum.SUCCESS,
      message: 'Reset password email sent successfully',
    };
  }

  async resetPassword(req: Request) {
    const { token, password } = req.body;
    if (!token) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Invalid reset token',
      };
    }

    const user = await prisma.users.findUnique({
      where: { verification_link: token },
    });

    if (!user) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Invalid reset token',
      };
    }
    if (user.provider !== 'credentials') {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Social login cannot reset password',
      };
    }

    if (!user.is_verified) {
      return {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: 'Email is not verified yet',
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
        message: 'Reset link has expired',
      };
    }

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        password: await hashedPassword(password),
        // is_verified: true,
        verification_link: null,
        verification_expiry: null,
      },
    });

    return {
      code: 200,
      data: { email: updatedUser.email },
      status: statusEnum.SUCCESS,
      message: 'Password successfully reseted',
    };
  }

  async updateUser(req: Request) {
    const {
      emailUpdate,
      email,
      first_name,
      last_name,
      phone_number,
      password,
      newPassword,
    } = req.body;

    console.log('Updating user:', {
      emailUpdate,
      email,
      first_name,
      last_name,
      phone_number,
      password,
      newPassword,
    });

    const existingUser = (await getUserByEmail(email)) as IUser;

    if (existingUser.email !== emailUpdate) {
      const verificationToken = uuidv4();
      const tokenExpiry = new Date(Date.now() + 3600000);
      console.log('SELISIH WAKTU', Date.now(), tokenExpiry);
      await sendVerificationEmail(emailUpdate, verificationToken);

      const emailUpdatedUser = await prisma.users.update({
        where: {
          email: existingUser.email,
        },
        data: {
          is_verified: false,
          verification_link: verificationToken,
          verification_expiry: tokenExpiry,
          first_name: first_name,
          last_name: last_name,
          phone_number: phone_number,
          email: emailUpdate,
          // password: await hashedPassword(password),
        },
      });

      return {
        code: 200,
        data: emailUpdatedUser,
        status: statusEnum.SUCCESS,
        message: 'Profile successfully updated',
      };
    }

    if (existingUser.email === emailUpdate) {
      const updatedUser = await prisma.users.update({
        where: { email },
        data: {
          first_name: first_name,
          last_name: last_name,
          phone_number: phone_number,
          //password: await hashedPassword(password),
        },
      });

      console.log('UDATEDUSER', updatedUser);
      return {
        code: 200,
        data: updatedUser,
        status: statusEnum.SUCCESS,
        message: 'Profile successfully updated',
      };
    }

    if (existingUser.password !== (await hashedPassword(password))) {
      return {
        code: 401,
        data: null,
        status: statusEnum.FAILED,
        message: `The password that you've entered is incorrect.`,
      };
    }

    if (existingUser.password !== (await hashedPassword(newPassword))) {
      const updatePass = await prisma.users.update({
        where: { email },
        data: { password: await hashedPassword(newPassword) },
      });
      console.log('EMAIL TERGANTI', updatePass);
      return {
        code: 200,
        data: updatePass,
        status: statusEnum.SUCCESS,
        message: 'Password successfully updated',
      };
    }

    return {
      code: 200,
      data: null,
      status: statusEnum.SUCCESS,
      message: 'Profile successfully updated',
    };
  }

  async getUserByEmail(req: Request) {
    const { email } = req.body;
    const getUser = await prisma.users.findUnique({
      where: { email },
      select: {
        first_name: true,
        last_name: true,
        phone_number: true,
        email: true,
        is_verified: true,
        image_url: true,
        provider: true,
        role: true,
      },
    });
    if (!getUser) {
      throw new Error('User not found');
    }

    if (!getUser?.is_verified) {
      throw new Error('The email is not verified');
    }

    return {
      code: 200,
      data: getUser,
      status: statusEnum.SUCCESS,
      message: 'Successfully fetch data profile',
    };
  }

  async updateImage(req: Request) {
    const { email, imageUrl } = req.body;

    await prisma.users.update({
      where: { email },
      data: {
        image_url: imageUrl,
      },
    });

    return {
      code: 200,
      data: null,
      status: statusEnum.SUCCESS,
      message: 'Successfully update profile image',
    };
  }

  async socialRegister(req: Request) {
    try {
      const { email, fullName, image, provider, provider_id, role } = req.body;

      if (!email || !provider) {
        throw new Error('Email and provider are required');
      }

      const token = await registerSocialUser({
        email,
        name: fullName,
        image,
        provider,
        provider_id,
        role,
      });

      return {
        code: 200,
        data: token,
        status: statusEnum.SUCCESS,
        message: 'Successfully social login',
      };
    } catch (error: any) {
      console.error('Social login error:', error);
      throw new Error('Error during social login');
    }
  }
}

export default new AuthService();
