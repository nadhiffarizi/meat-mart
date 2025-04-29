import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import transactionService from '@/services/transaction/transaction.service';
import orderService from '@/services/order/order.service';
import orderQueryService from '@/services/order/orderQuery.service';


export class OrderController {
    public async getOrderListUser(req: Request, res: Response, next: NextFunction) {
        try {
            // try create order
            const data: serviceFeedback = await orderQueryService.getOrderListUser(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }
    public async getOrderListAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            // try get order list by admin
            const data: serviceFeedback = await orderQueryService.getOrderListAdmin(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

    public async cancelOrderByAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            // try get order list by admin
            const data: serviceFeedback = await orderService.cancelOrderByAdmin(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

    public async confirmOrderByCust(req: Request, res: Response, next: NextFunction) {
        try {
            // try get order list by admin
            const data: serviceFeedback = await orderService.confirmOrderByCust(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

    public async sendOrderByAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            // try get order list by admin
            const data: serviceFeedback = await orderService.sendOrderByAdmin(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }
}

export default new OrderController()