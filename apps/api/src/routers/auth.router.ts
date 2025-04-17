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
    this.router.post('/verify', authController.verify);
    this.router.post('/resend-verification', authController.resendVerification);
    this.router.post('/login', authController.login);
    this.router.post('/token', verifyRefreshToken, authController.refreshToken);
    this.router.get('/users', authController.getUsers);
    // this.router.post("/mail", authController.sendVerificationEmail);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new AuthRouter();
