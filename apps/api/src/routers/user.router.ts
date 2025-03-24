import authController, { AuthController } from '@/controllers/auth.controller';
import userController from '@/controllers/user.controller';
import { Router } from 'express';

export class UserRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/get/customer', userController.getCustomer);
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new UserRouter()
