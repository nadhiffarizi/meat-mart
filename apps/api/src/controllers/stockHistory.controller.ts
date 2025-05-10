import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import stockHistoryService from '@/services/stockHistory.service';
import { statusEnum } from '@/enums/statusEnum.enums';

export class StockHistoryController {
  public async getAllStockHistoriesInAMonth(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
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

      const data: serviceFeedback =
        await stockHistoryService.getAllStockHistoriesInAMonth(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async getStockHistoryRangeByStoreAndProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
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

      const data: serviceFeedback =
        await stockHistoryService.getStockHistoryRangeByStoreAndProduct(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new StockHistoryController();
