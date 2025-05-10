import transactionController from '@/controllers/transaction.controller';
import { uploader } from '@/helper/multer.helper';
import { verifyToken } from '@/middleware/authorize.middleware';
import { Router } from 'express';
import express from 'express'
export class TransactionRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT

    this.router.post('/notif/midtrans', express.raw({ type: 'application/json' }), transactionController.notifMidtrans);
    this.router.post('/create', verifyToken, transactionController.create);
    this.router.post('/create/midtrans', transactionController.createMidtrans);
    this.router.post('/cancel', verifyToken, transactionController.cancel);
    this.router.post('/admin/rejectpayment', verifyToken, transactionController.rejectPaymentProof);
    this.router.post('/admin/confirmpayment', verifyToken, transactionController.adminConfirm);
    this.router.post('/upload/paymentproof', verifyToken, uploader().single("image"), transactionController.uploadTrxProof);
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new TransactionRouter()
