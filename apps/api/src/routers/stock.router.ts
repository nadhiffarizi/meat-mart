import stockController from '@/controllers/stock.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { validateStockUpdateBody } from '@/middleware/stock.middleware';
import { Router } from 'express';

export class StockRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, stockController.getStock);
    this.router.get('/all', verifyToken, stockController.getAllStocks);
    this.router.get(
      '/summary',
      verifyToken,
      stockController.getAllStockSummary,
    );
    this.router.post(
      '/',
      verifyToken,
      validateStockUpdateBody,
      stockController.updateStock,
    );
    // .... continue api
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new StockRouter();
