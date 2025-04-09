import authController, { AuthController } from '@/controllers/auth.controller';
import cartController from '@/controllers/cart.controller';
import orderController from '@/controllers/transaction.controller';
import { Router } from 'express';

export class CartRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT

    this.router.post('/add', cartController.add);
    this.router.post('/subtract', cartController.subtract);
    this.router.get("/get", cartController.getCart);
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new CartRouter()
