import categoryController from '@/controllers/category.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { validateCategoryCreateAndUpdateBody } from '@/middleware/category.middleware';
import { Router } from 'express';

export class CategoryRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/all', categoryController.getAllCategories);
    this.router.get('/', categoryController.getCategory);

    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new CategoryRouter();
