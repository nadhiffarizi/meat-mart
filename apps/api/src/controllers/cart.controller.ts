import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import authService from '@/services/auth.service';
import orderService from '@/services/transaction/transaction.service';
import cartService from '@/services/cart.service';

export class CartController {
  public async add(req: Request, res: Response, next: NextFunction) {
    try {
      // try registering
      const data: serviceFeedback = await cartService.add(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      // try get cart
      const data: serviceFeedback = await cartService.getCart(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async subtract(req: Request, res: Response, next: NextFunction) {
    try {
      // try get cart
      const data: serviceFeedback = await cartService.subtract(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async updateCartQuantity(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // try update cart quantity
      const data: serviceFeedback = await cartService.updateQuantity(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async getTotalPage(req: Request, res: Response, next: NextFunction) {
    try {
      // try update cart quantity
      const data: serviceFeedback = await cartService.getTotalPage(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
