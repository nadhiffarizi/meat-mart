import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import authService from '@/services/auth.service';
import orderService from '@/services/transaction.service';
import cartService from '@/services/cart.service';
import discountService from '@/services/discount.service';


export class DiscountController {
    public async getDiscounts(req: Request, res: Response, next: NextFunction) {
        try {
            // try registering
            const data: serviceFeedback = await discountService.getDiscounts(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

    public async redeemDiscount(req: Request, res: Response, next: NextFunction) {
        try {
            // try registering
            const data: serviceFeedback = await discountService.redeemDiscount(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

}

export default new DiscountController()