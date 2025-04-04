import authController, { AuthController } from '@/controllers/auth.controller';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', authController.register);
    this.router.post('/login', authController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new AuthRouter();
