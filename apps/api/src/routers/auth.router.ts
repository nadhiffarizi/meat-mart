import authController, { AuthController } from '@/controllers/auth.controller';
import {
  verifyRefreshToken,
  verifyToken,
} from '@/middleware/authorize.middleware';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', authController.register);
    this.router.post('/social', authController.socialRegister);
    this.router.post('/verify', authController.verify);
    this.router.post('/resend-verification', authController.resendVerification);
    this.router.post('/reset-email', authController.resetEmail);
    this.router.post('/reset-password', authController.resetPassword);
    this.router.post('/login', authController.login);
    this.router.post('/token', verifyRefreshToken, authController.refreshToken);
    this.router.post('/profile', authController.getUserByEmail);
    this.router.post(
      '/profile/image',
      verifyToken,
      authController.updateImageProfile,
    );
    this.router.get('/users', authController.getUsers);
    this.router.patch('/', verifyToken, authController.updateUser);
    // this.router.post("/mail", authController.sendVerificationEmail);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new AuthRouter();
