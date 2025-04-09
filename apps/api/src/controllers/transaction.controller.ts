import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import transactionService from '@/services/transaction.service';


export class TransactionController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            // try create order
            const data: serviceFeedback = await transactionService.create(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

    public async cancel(req: Request, res: Response, next: NextFunction) {
        try {
            // try create order
            const data: serviceFeedback = await transactionService.cancel(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

    public async uploadTrxProof(req: Request, res: Response, next: NextFunction) {
        try {
            // try uploading payment proof
            const data: serviceFeedback = await transactionService.uploadTrxProof(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }


}

export default new TransactionController()