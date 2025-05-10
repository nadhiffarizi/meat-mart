import { NextFunction, Request, Response } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import stockService from '@/services/stock.service';
import { statusEnum } from '@/enums/statusEnum.enums';
import '@/interface/global.interface';

export class StockController {
  async getAllStocks(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await stockService.getAllStocks(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async getStock(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await stockService.getStock(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await stockService.updateStock(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new StockController();
