import categoryController from '@/controllers/category.controller.ts';
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
    this.router.get('/', verifyToken, categoryController.readCategories);
    this.router.get('/:id', verifyToken, categoryController.readCategory);
    this.router.post(
      '/',
      verifyToken,
      validateCategoryCreateAndUpdateBody,
      categoryController.createCategory,
    );
    this.router.patch(
      '/:id',
      verifyToken,
      validateCategoryCreateAndUpdateBody,
      categoryController.updateCategory,
    );
    this.router.delete('/:id', verifyToken, categoryController.deleteCategory);
    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new CategoryRouter();
