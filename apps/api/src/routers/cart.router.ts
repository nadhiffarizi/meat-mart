import authController, { AuthController } from '@/controllers/auth.controller';
import cartController from '@/controllers/cart.controller';
import orderController from '@/controllers/transaction.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { Router } from 'express';

export class CartRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT

    this.router.post('/add', verifyToken, cartController.add);
    this.router.post('/subtract', verifyToken, cartController.subtract);
    this.router.get("/get/:page", verifyToken, cartController.getCart);
    this.router.put("/update", verifyToken, cartController.updateCartQuantity);
    this.router.get("/totalpage", verifyToken, cartController.getTotalPage);

    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new CartRouter()
