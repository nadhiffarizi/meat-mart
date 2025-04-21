import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import transactionService from '@/services/transaction.service';
import transactionQueryService from '@/services/transactionQuery.service';


export class TransactionQueryController {
    public async getTransactionListUser(req: Request, res: Response, next: NextFunction) {
        try {
            // try create order
            const data: serviceFeedback = await transactionQueryService.getTransactionListUser(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

}

export default new TransactionQueryController()