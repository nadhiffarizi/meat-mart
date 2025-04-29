import transactionQueryController from '@/controllers/transactionQuery.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { Router } from 'express';

export class TransactionQueryRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT 

    this.router.get('/', transactionQueryController.getTransactionListUser);
    this.router.get('/admin', verifyToken, transactionQueryController.getTransactionListAdmin);
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new TransactionQueryRouter()
