import productController from '@/controllers/product.dashboard.controller';
import { uploader } from '@/helper/multer.helper';
import { verifyToken } from '@/middleware/authorize.middleware';
import {
  validateProductCreateBody,
  validateProductUpdateBody,
} from '@/middleware/product.middleware';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/all', verifyToken, productController.getAllProducts);
    this.router.get('/', verifyToken, productController.getProduct);
    this.router.post(
      '/uploadProductPicture/:productId',
      verifyToken,
      uploader().single('picture'),
      productController.uploadProductPicture,
    );
    this.router.post(
      '/',
      verifyToken,
      validateProductCreateBody,
      productController.createProduct,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      validateProductUpdateBody,
      productController.updateProduct,
    );
    this.router.delete('/:id', verifyToken, productController.deleteProduct);
    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new ProductRouter();
