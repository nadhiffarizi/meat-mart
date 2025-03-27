import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getUserByEmail } from '@/helpers/user.prisma';

class AdminService {
  async getAllUsers(req: Request) {
    if (
      req.query.role &&
      !['SUPER_ADMIN', 'ADMIN', 'CUSTOMER'].includes(
        String(req.query.role).toUpperCase(),
      )
    ) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `${req.query.role} is not a valid role.`,
      };
      return feedback;
    }

    if (req.query.role) {
      const newRole = String(req.query.role).toUpperCase();
      const allUsers = await prisma.users.findMany({
        where: {
          role: newRole as 'SUPER_ADMIN' | 'ADMIN' | 'CUSTOMER',
        },
      });
      const feedback: serviceFeedback = {
        code: 200,
        data: allUsers,
        status: statusEnum.SUCCESS,
        message: `Successfully fetched all users with role ${req.query.role}.`,
      };
      return feedback;
    }

    const allUsers = await prisma.users.findMany();
    const feedback: serviceFeedback = {
      code: 200,
      data: allUsers,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all users.`,
    };
    return feedback;
  }

  async createAdmin(req: Request) {
    const existingUser = await getUserByEmail(String(req.body.email));

    if (existingUser) {
      const feedback: serviceFeedback = {
        code: 409,
        data: null,
        status: statusEnum.FAILED,
        message: `User with email ${req.body.email} already exists.`,
      };
      return feedback;
    }

    const newAdmin = await prisma.users.create({
      data: req.body,
    });
    const feedback: serviceFeedback = {
      code: 201,
      data: newAdmin,
      status: statusEnum.SUCCESS,
      message: `Admin with email ${req.body.email} successfully registered.`,
    };
    return feedback;
  }
}

export default new AdminService();
