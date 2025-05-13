import adminController from '@/controllers/admin.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import {
  validateAdminCreateBody,
  validateAdminUpdateBody,
} from '@/middleware/user.middleware';
import { Router } from 'express';

export class AdminRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/users/all', verifyToken, adminController.getAllUsers);
    this.router.get('/users', verifyToken, adminController.getUser);
    this.router.get('/get', adminController.getAdmin);
    this.router.get('/get-list', adminController.getAdminByCity);
    this.router.post(
      '/users',
      verifyToken,
      validateAdminCreateBody,
      adminController.createUsers,
    );
    this.router.patch(
      '/users/:id',
      verifyToken,
      validateAdminUpdateBody,
      adminController.updateUsers,
    );
    this.router.delete('/users/:id', verifyToken, adminController.deleteUsers);
    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new AdminRouter();
