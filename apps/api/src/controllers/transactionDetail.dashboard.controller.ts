import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import transactionDetailService from '@/services/transactionDetail.dashboard.service';
import { statusEnum } from '@/enums/statusEnum.enums';
import '@/interface/global.interface';

export class TransactionDetailController {
  async getAllTransactionDetailSummary(
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

      let data: serviceFeedback =
        await transactionDetailService.getAllTransactionDetailSummary(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionDetailController();
