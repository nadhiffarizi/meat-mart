import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import orderQueryService from '@/services/order/orderQuery.service';

export class OrderControllerQuery {
  public async getOrderListUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // try create order
      const data: serviceFeedback =
        await orderQueryService.getOrderListUser(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async getOrderListUserTotalPage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // try create order
      const data: serviceFeedback =
        await orderQueryService.getOrderListUserTotalPage(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async getOrderListAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // try get order list by admin
      const data: serviceFeedback =
        await orderQueryService.getOrderListAdmin(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async getOrderListAdminTotalPage(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // try create order
      const data: serviceFeedback =
        await orderQueryService.getOrderListAdminTotalPage(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderControllerQuery();
