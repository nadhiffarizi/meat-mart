import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import authService from '@/services/auth.service';
import orderService from '@/services/order.service';


export class OrderController {
    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            // try registering
            const data: serviceFeedback = await orderService.create(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

}

export default new OrderController()