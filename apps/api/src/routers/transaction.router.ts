import transactionController from '@/controllers/transaction.controller';
import { uploader } from '@/helper/multer.helper';
import { Router } from 'express';

export class TransactionRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT 

    this.router.post('/create', transactionController.create);
    this.router.post('/cancel', transactionController.cancel);
    this.router.post('/admin/rejectpayment', transactionController.rejectPaymentProof);
    this.router.post('/admin/confirmpayment', transactionController.adminConfirm);
    this.router.post('/upload/paymentproof', uploader().single("image"), transactionController.uploadTrxProof);
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new TransactionRouter()
