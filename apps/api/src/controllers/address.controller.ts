import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helpers/responseHandler.helper';
import authService from '@/services/auth.service';
import addressService from '@/services/address.service';

export class AddressController {
  public async getAddressByEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await addressService.getAddressByEmail(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async addFirstAddress(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await addressService.selectedFirstAddress(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await addressService.updateAddressById(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await addressService.deleteAddressById(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async updateIsSelected(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await addressService.updateIsSelected(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default new AddressController();
