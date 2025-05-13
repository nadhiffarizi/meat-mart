import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import orderService from '@/services/order/order.service';
import orderAdminService from '@/services/order/orderAdmin.service';

export class OrderController {
  public async cancelOrderByAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // try get order list by admin
      const data: serviceFeedback =
        await orderAdminService.cancelOrderAdmin(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async confirmOrderByCust(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // try get order list by admin
      const data: serviceFeedback = await orderService.confirmOrderByCust(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async sendOrderByAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // try get order list by admin
      const data: serviceFeedback =
        await orderAdminService.sendOrderByAdmin(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
