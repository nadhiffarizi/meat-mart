import { Request, Response, NextFunction } from 'express';
import { responseHandler } from '../helpers/responseHandler.helper';
import storeService from '@/services/store.service';

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
}

export default new StoreController();
