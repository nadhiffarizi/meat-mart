import authController, { AuthController } from '@/controllers/auth.controller';
import { verifyRefreshToken } from '@/middleware/authorize.middleware';
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
    // this.router.post('/token', verifyRefreshToken, authController.refreshToken);
    this.router.get('/users', authController.getUsers);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new AuthRouter();
