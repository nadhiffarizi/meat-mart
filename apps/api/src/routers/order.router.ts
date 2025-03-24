import authController, { AuthController } from '@/controllers/auth.controller';
import orderController from '@/controllers/order.controller';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT 

    this.router.post('/create', orderController.create);
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new OrderRouter()
