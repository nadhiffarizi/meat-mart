import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getUserByEmail, getUserById } from '@/helper/user.prisma';
import { hashedPassword } from '@/helper/bcrypt';

class AdminService {
  async getAllUsers(req: Request) {
    let allUsers;
    if (req.query.includeDeleted === 'true') {
      allUsers = await prisma.users.findMany();
    } else {
      allUsers = await prisma.users.findMany({
        where: {
          deleted_at: null,
        },
      });
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: allUsers,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all users.`,
    };
    return feedback;
  }

  async getUser(req: Request) {
    if (!req.query.email && !req.query.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Email or ID is required to fetch a user.`,
      };
      return feedback;
    }

    let user;

    if (req.query.email) {
      user = await getUserByEmail(req.query.email as string);
    }

    if (req.query.id) {
      user = await getUserById(req.query.id as string);
    }

    if (
      (user && user.deleted_at && req.query.includeDeleted !== 'true') ||
      !user
    ) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: req.query.email
          ? `User with email ${req.params.email} does not exist.`
          : `User with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: user,
      status: statusEnum.SUCCESS,
      message: req.query.email
        ? `Successfully fetched user with email ${req.params.email}.`
        : `Successfully fetched user with ID ${req.params.id}.`,
    };
    return feedback;
  }

  async createAdmin(req: Request) {
    const existingUser = await getUserByEmail(String(req.body.email));

    if (
      req.query.restore === 'true' &&
      existingUser &&
      existingUser.deleted_at
    ) {
      const restoredCategory = await prisma.users.update({
        where: { email: req.body.email },
        data: { deleted_at: null },
      });
      const feedback: serviceFeedback = {
        code: 200,
        data: restoredCategory,
        status: statusEnum.SUCCESS,
        message: `User with email ${req.body.email} has been restored.`,
      };
      return feedback;
    }

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
      data: {
        ...req.body,
        password: await hashedPassword(req.body.password),
        role: 'ADMIN',
        is_verified: true,
      },
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

    if (!existingUser || existingUser.deleted_at) {
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

    const updatedAdmin = await prisma.users.update({
      data: { ...req.body, password: await hashedPassword(req.body.password) },
      where: {
        id: req.params.id,
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: updatedAdmin,
      status: statusEnum.SUCCESS,
      message: `Admin with ID ${req.params.id} successfully updated.`,
    };
    return feedback;
  }

  async deleteAdmin(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to delete admin.`,
      };
      return feedback;
    }

    const existingUser = await getUserById(String(req.params.id));

    if (!existingUser || existingUser.deleted_at) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `User with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    if (existingUser.role !== 'ADMIN') {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `User with ID ${req.params.id} is not a store admin.`,
      };
      return feedback;
    }

    const deletedAdmin = await prisma.users.update({
      where: {
        id: req.params.id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: deletedAdmin,
      status: statusEnum.SUCCESS,
      message: `Admin with ID ${req.params.id} successfully deleted.`,
    };
    return feedback;
  }
}

export default new AdminService();
