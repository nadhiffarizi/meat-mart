import { NextFunction, Request, Response } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import storeService from '@/services/store.service';
import { statusEnum } from '@/enums/statusEnum.enums';
import '@/interface/global.interface';

export class StoreController {
  public async getStoreList(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await storeService.getList(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async createStore(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('CREATE STORE CONTROLLER');
      const data = await storeService.createStore(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async getStoreById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await storeService.getStoreById(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async updateStore(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await storeService.updateStoreById(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  public async daleteStore(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('DELETE CONTROLLER');
      const data = await storeService.deleteStoreById(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async getStoreByProvince(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await storeService.getListStoreByProvince(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async getAllStores(req: Request, res: Response, next: NextFunction) {
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

      let data: serviceFeedback = await storeService.getAllStores(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async getStore(req: Request, res: Response, next: NextFunction) {
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

      let data: serviceFeedback = await storeService.getStore(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new StoreController();
