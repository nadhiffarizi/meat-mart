import adminController from '@/controllers/admin.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import {
  validateAdminLoginBody,
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
    this.router.get('/users', verifyToken, adminController.readUsers);
    this.router.post(
      '/users',
      verifyToken,
      validateAdminLoginBody,
      adminController.createUsers,
    );
    this.router.patch(
      '/users/:email',
      verifyToken,
      validateAdminUpdateBody,
      adminController.updateUsers,
    );
    this.router.delete(
      '/users/:email',
      verifyToken,
      adminController.deleteUsers,
    );
    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new AdminRouter();
