import discountController from '@/controllers/discount.dashboard.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { validateCategoryCreateAndUpdateBody } from '@/middleware/category.middleware';
import {
  validateDiscountCreateBody,
  validateDiscountUpdateBody,
} from '@/middleware/discount.middleware';
import { Router } from 'express';

export class DiscountRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/all', verifyToken, discountController.getAllDiscounts);
    this.router.get('/', verifyToken, discountController.getDiscount);
    this.router.post(
      '/',
      verifyToken,
      validateDiscountCreateBody,
      discountController.createDiscount,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      validateDiscountUpdateBody,
      discountController.updateDiscount,
    );
    this.router.delete('/:id', verifyToken, discountController.deleteDiscount);
    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new DiscountRouter();
