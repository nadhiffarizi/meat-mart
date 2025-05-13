import authController, { AuthController } from '@/controllers/auth.controller';
import orderController from '@/controllers/transaction.controller';
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
    // dont forget to include middleware function before SIT
    this.router.get('/', productController.getProducts);
    this.router.get('/all', productController.getAllProducts);
    this.router.get(
      '/category/:categoryId',
      productController.getAllProductsByCategoryId,
    );
    this.router.get('/:id', productController.getProductById);
    this.router.get(
      '/picture/:productId',
      productController.getPicturesByProductId,
    );
    this.router.post('/', productController.createProduct);
    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new ProductRouter();
