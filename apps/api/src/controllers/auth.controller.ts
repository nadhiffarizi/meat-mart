import { Request, Response, NextFunction } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import authService from '@/services/auth.service';

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await authService.register(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
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

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await authService.getList(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const data: serviceFeedback = await authService.refreshToken(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.verifyEmailToken(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async resendVerification(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await authService.resendVerificationEmail(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async resetEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.resetPasswordEmail(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.resetPassword(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.updateUser(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  public async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.getUserByEmail(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async updateImageProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = await authService.updateImage(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public async socialRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.socialRegister(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

export default new AuthController();
