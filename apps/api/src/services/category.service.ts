import { statusEnum } from '@/enums/statusEnum.enums';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { Request } from 'express';
import prisma from '@/prisma';
import { getCategoryById, getCategoryByName } from '@/helper/category.prisma';

class CategoryService {
  async getAllCategories(req: Request) {
    let allCategories;
    if (req.query.includeDeleted === 'true') {
      allCategories = await prisma.categories.findMany();
    } else {
      allCategories = await prisma.categories.findMany({
        where: {
          deleted_at: null,
        },
      });
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: allCategories,
      status: statusEnum.SUCCESS,
      message: `Successfully fetched all categories.`,
    };
    return feedback;
  }

  async getCategory(req: Request) {
    if (!req.query.name && !req.query.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `Name or ID is required to fetch category.`,
      };
      return feedback;
    }

    let category;

    if (req.query.name) {
      category = await getCategoryByName(req.query.name as string);
    }

    if (req.query.id) {
      category = await getCategoryById(req.query.id as string);
    }

    if (
      (category &&
        category.deleted_at &&
        req.query.includeDeleted !== 'true') ||
      !category
    ) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: req.query.name
          ? `Category with name ${req.query.name} does not exist.`
          : `Category with ID ${req.query.id} does not exist.`,
      };
      return feedback;
    }

    const feedback: serviceFeedback = {
      code: 200,
      data: category,
      status: statusEnum.SUCCESS,
      message: req.query.name
        ? `Successfully fetched category with name ${req.query.name}.`
        : `Successfully fetched category with ID ${req.query.id}.`,
    };
    return feedback;
  }

  async createCategory(req: Request) {
    const existingCategory = await getCategoryByName(req.body.name);

    if (
      req.query.restore === 'true' &&
      existingCategory &&
      existingCategory.deleted_at
    ) {
      const restoredCategory = await prisma.categories.update({
        where: { name: req.body.name },
        data: { deleted_at: null },
      });
      const feedback: serviceFeedback = {
        code: 200,
        data: restoredCategory,
        status: statusEnum.SUCCESS,
        message: `Category with name ${req.body.name} has been restored.`,
      };
      return feedback;
    }

    if (existingCategory) {
      const feedback: serviceFeedback = {
        code: 409,
        data: null,
        status: statusEnum.FAILED,
        message: `Category with name ${req.body.name} already exists.`,
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
      message: `Category with name ${req.body.name} successfully created.`,
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

    const existingCategory = await getCategoryById(req.params.id);

    if (!existingCategory || existingCategory.deleted_at) {
      const feedback: serviceFeedback = {
        code: 404,
        data: null,
        status: statusEnum.FAILED,
        message: `Category with ID ${req.params.id} does not exist.`,
      };
      return feedback;
    }

    const existingCategoryName = await getCategoryByName(req.body.name);
    if (existingCategoryName && existingCategoryName.id !== req.params.id) {
      const feedback: serviceFeedback = {
        code: 400,
        data: null,
        status: statusEnum.FAILED,
        message: `${req.body.name} is identical to another category name. Category names must be unique.`,
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

    const existingCategory = await getCategoryById(req.params.id);

    if (!existingCategory || existingCategory.deleted_at) {
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
