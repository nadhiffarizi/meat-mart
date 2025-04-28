import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getUserByEmail, getUserById } from '@/helper/user.prisma';
import { hashedPassword } from '@/helper/bcrypt';

class CategoryService {
  async getAllCategories(req: Request) {
    const allCategories = await prisma.categories.findMany({
      where: {
        deleted_at: null,
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: allCategories,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all categories.`,
    };
    return feedback;
  }

  async getCategoryById(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to fetch category.`,
      };
      return feedback;
    }

    const category = await prisma.categories.findUnique({
      where: {
        id: req.params.id,
        deleted_at: null,
      },
    });

    const feedback: serviceFeedback = {
      code: 200,
      data: category,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched category with ID ${req.params.id}.`,
    };
    return feedback;
  }

  async createCategory(req: Request) {
    const existingCategory = await prisma.categories.findUnique({
      where: {
        name: req.body.name,
        deleted_at: null,
      },
    });

    if (existingCategory) {
      const feedback: serviceFeedback = {
        code: 409,
        data: null,
        status: statusEnum.FAILED,
        message: `Category with label ${req.body.name} already exists.`,
      };
      return feedback;
    }

    const newCategory = await prisma.categories.create({
      data: {
        ...req.body,
      },
    });
    const feedback: serviceFeedback = {
      code: 201,
      data: newCategory,
      status: statusEnum.SUCCESS,
      message: `Category with label ${req.body.name} successfully created.`,
    };
    return feedback;
  }

  async updateCategory(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to update category.`,
      };
      return feedback;
    }

    const existingCategory = await prisma.categories.findUnique({
      where: {
        id: req.params.id,
        deleted_at: null,
      },
    });

    if (!existingCategory) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Category with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    const updatedCategory = await prisma.categories.update({
      data: req.body,
      where: {
        id: req.params.id,
      },
    });
    const feedback: serviceFeedback = {
      code: 200,
      data: updatedCategory,
      status: statusEnum.SUCCESS,
      message: `Category with ID ${req.params.id} successfully updated.`,
    };
    return feedback;
  }

  async deleteCategory(req: Request) {
    if (!req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `ID is required to delete category.`,
      };
      return feedback;
    }

    const existingCategory = await prisma.categories.findUnique({
      where: {
        id: req.params.id,
        deleted_at: null,
      },
    });

    if (!existingCategory) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Category with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    const deletedAdmin = await prisma.categories.update({
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
      message: `Category with ID ${req.params.id} successfully deleted.`,
    };
    return feedback;
  }
}

export default new CategoryService();
