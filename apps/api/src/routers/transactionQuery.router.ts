import transactionQueryController from '@/controllers/transactionQuery.controller';
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
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new TransactionQueryRouter()
