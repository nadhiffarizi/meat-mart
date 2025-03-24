import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import authService from '@/services/auth.service';
import orderService from '@/services/order.service';
import cartService from '@/services/cart.service';


export class CartController {
    public async add(req: Request, res: Response, next: NextFunction) {
        try {
            // try registering
            const data: serviceFeedback = await cartService.add(req)
            responseHandler(res, data.message, data.status, data.data, data.code)

        } catch (error) {
            next(error)
        }
    }

}

export default new CartController()