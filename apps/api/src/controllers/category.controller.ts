import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import categoryService from '@/services/category.service';
import { statusEnum } from '@/enums/statusEnum.enums';
import '@/interface/global.interface';

export class CategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      let data: serviceFeedback = await categoryService.getAllCategories(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      let data: serviceFeedback = await categoryService.getCategory(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new CategoryController();
