import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import authService from '@/services/auth.service';

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      // try registering
      const data: serviceFeedback = await authService.register(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      // try logging in
      const data: serviceFeedback = await authService.login(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
