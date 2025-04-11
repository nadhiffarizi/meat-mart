import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import productService from '@/services/product.service';

export class ProductController {
  public async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await productService.create(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
  public async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await productService.getAllProducts(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  // public async refreshToken(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const data = await authService.refreshToken(req);
  //     responseHandler(res, 'refresh token success', data.);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default new ProductController();
