import productController from '@/controllers/product.controller';
import { verifyRefreshToken } from '@/middleware/authorize.middleware';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', productController.getProducts);
    this.router.post('/', productController.createProduct);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new ProductRouter();
