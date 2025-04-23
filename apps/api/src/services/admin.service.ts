import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getUserByEmail, getUserById } from '@/helpers/user.prisma';

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

  async getUserById(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to fetch admin.`,
      };
      return feedback;
    }

    const user = await getUserById(req.params.id);
    const feedback: serviceFeedback = {
      code: 200,
      data: user,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched user with ID ${req.params}.`,
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
      data: { ...req.body, role: 'ADMIN', is_verified: true },
    });
    const feedback: serviceFeedback = {
      code: 201,
      data: newAdmin,
      status: statusEnum.SUCCESS,
      message: `Admin with email ${req.body.email} successfully registered.`,
    };
    return feedback;
  }

  async updateAdmin(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to update admin.`,
      };
      return feedback;
    }

    const existingUser = await getUserById(String(req.params.id));

    if (!existingUser) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `User with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    if (existingUser?.role !== 'ADMIN') {
      const feedback: serviceFeedback = {
        code: 403,
        data: null,
        status: statusEnum.FAILED,
        message: `User with ID ${req.params.id} is not a store admin.`,
      };
      return feedback;
    }

    if (req.body.id) {
      const otherExistingUser = await getUserById(String(req.body.id));

      // if (otherExistingUser && otherExistingUser.email !== req.params.email) {
      //   const feedback: serviceFeedback = {
      //     code: 400,
      //     data: null,
      //     status: statusEnum.FAILED,
      //     message: `Another user with email ${req.body.email} already exists.`,
      //   };
      //   return feedback;
      // }
    }

    const updatedAdmin = await prisma.users.update({
      data: req.body,
      where: {
        id: req.params.id,
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: updatedAdmin,
      status: statusEnum.SUCCESS,
      message: `Admin with ID ${req.body.id} successfully updated.`,
    };
    return feedback;
  }

  async deleteAdmin(req: Request) {
    if (!req.params.email) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Email is required to delete admin.`,
      };
      return feedback;
    }

    const existingUser = await getUserByEmail(String(req.params.email));

    if (!existingUser) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `User with email ${req.params.email} does not exist.`,
      };
      return feedback;
    }

    if (existingUser.role !== 'ADMIN') {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `User with email ${req.params.email} is not a store admin.`,
      };
      return feedback;
    }

    const deletedAdmin = await prisma.users.delete({
      where: {
        email: req.params.email,
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: deletedAdmin,
      status: statusEnum.SUCCESS,
      message: `Admin with email ${req.params.email} successfully deleted.`,
    };
    return feedback;
  }
}

export default new AdminService();
