import transactionDetailController from '@/controllers/transactionDetail.dashboard.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { validateCategoryCreateAndUpdateBody } from '@/middleware/category.middleware';
import { Router } from 'express';

export class TransactionDetailRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/summary',
      verifyToken,
      transactionDetailController.getAllTransactionDetailSummary,
    );

    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new TransactionDetailRouter();
