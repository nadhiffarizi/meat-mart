import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import prisma from '@/prisma';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { jwtAccessSecret } from '@/config';

class AuthService {
  async register(req: Request) {
    const email = 'hawktuah@gmail.com';

    const registeredUser = await prisma.users.create({
      data: {
        first_name: 'Hawk',
        last_name: 'Tuah',
        email: email,
        password: 'password',
        role: 'CUSTOMER',
        phone_number: '9',
        is_verified: true,
        verification_link: 'Abc',
        created_at: new Date(),
        updated_at: new Date(),
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
    let email = 'shadrachmulia@gmail.com';

    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    const { password, ...userWithoutPassword } = JSON.parse(
      JSON.stringify(existingUser),
    );

    const token = sign(userWithoutPassword, jwtAccessSecret, {
      expiresIn: '20m',
    });

    return {
      code: 200,
      data: token,
      status: statusEnum.SUCCESS,
      message: `Successfully logged user with email ${email} in.`,
    };
  }
}

export default new AuthService();
