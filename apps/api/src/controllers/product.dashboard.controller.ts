import { NextFunction, Request, Response } from 'express';
import prisma from '@/prisma';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import productService from '@/services/product.dashboard.service';
import { statusEnum } from '@/enums/statusEnum.enums';
import '@/interface/global.interface';

export class ProductController {
  async getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await productService.getAllProducts(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await productService.getProduct(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async uploadProductPicture(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback =
        await productService.uploadProductPicture(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await productService.createProduct(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await productService.updateProduct(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user?.role !== 'SUPER_ADMIN') {
        return responseHandler(
          res,
          `You have insufficient permission to access.`,
          statusEnum.FAILED,
          null,
          403,
        );
      }

      let data: serviceFeedback = await productService.deleteProduct(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new ProductController();
