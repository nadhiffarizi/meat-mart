import authController, { AuthController } from '@/controllers/auth.controller';
import cartController from '@/controllers/cart.controller';
import discountController from '@/controllers/discount.controller';
import orderController from '@/controllers/transaction.controller';
import { Router } from 'express';

export class DiscountRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT

    this.router.get('/get/:cartId', discountController.getDiscounts);
    // this.router.post('/redeem', discountController.redeemDiscount);
    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new DiscountRouter();
