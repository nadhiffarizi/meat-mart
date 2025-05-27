import stockHistoryController from '@/controllers/stockHistory.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { Router } from 'express';

export class StockHistoryRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/all',
      verifyToken,
      stockHistoryController.getAllStockHistoriesInAMonth,
    );
    this.router.get(
      '/range',
      verifyToken,
      stockHistoryController.getStockHistoryRangeByStoreAndProduct,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new StockHistoryRouter();
