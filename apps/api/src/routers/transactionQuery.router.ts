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

    this.router.get('/', verifyToken, transactionQueryController.getTransactionListUser);
    this.router.get('/totalpage', verifyToken, transactionQueryController.getTrxListUserCountPage);
    this.router.get('/admin', verifyToken, transactionQueryController.getTransactionListAdmin);
    this.router.get('/admin/totalpage', verifyToken, transactionQueryController.getTrxListAdminCountPage);

    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new TransactionQueryRouter()
