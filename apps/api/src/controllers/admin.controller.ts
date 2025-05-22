import { NextFunction, Request, Response } from 'express';
import { serviceFeedback } from '@/interface/serviceFeedback.interface';
import { responseHandler } from '@/helper/responseHandler.helper';
import adminService from '@/services/admin.service';
import { statusEnum } from '@/enums/statusEnum.enums';
import '@/interface/global.interface';

export class AdminController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
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

      let data: serviceFeedback = await adminService.getAllUsers(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
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

      let data: serviceFeedback = await adminService.getUser(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async createUsers(req: Request, res: Response, next: NextFunction) {
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

      let data: serviceFeedback = await adminService.createAdmin(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async updateUsers(req: Request, res: Response, next: NextFunction) {
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

      let data: serviceFeedback = await adminService.updateAdmin(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async deleteUsers(req: Request, res: Response, next: NextFunction) {
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

      let data: serviceFeedback = await adminService.deleteAdmin(req);

      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
  async getAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getListAdmin(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }

  async getAdminByCity(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getListAdminByCity(req);
      responseHandler(res, data.message, data.status, data.data, data.code);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
