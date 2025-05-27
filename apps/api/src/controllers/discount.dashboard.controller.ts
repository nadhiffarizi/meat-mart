import { NextFunction, Request, Response } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import discountService from '@/services/discount.dashboard.service';
import { statusEnum } from '@/enums/statusEnum.enums';
import '@/interface/global.interface';

export class DiscountController {
  async getAllDiscounts(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await discountService.getAllDiscounts(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async getDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await discountService.getDiscount(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await discountService.createDiscount(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async updateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await discountService.updateDiscount(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async deleteDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await discountService.deleteDiscount(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new DiscountController();
