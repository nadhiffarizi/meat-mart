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
}

export default new CategoryService();
