import orderController from '@/controllers/order.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { Router } from 'express';
import { verify } from 'jsonwebtoken';

export class OrderRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT 
    this.router.post('/admin/cancel', verifyToken, orderController.cancelOrderByAdmin);
    this.router.post("/admin/sendorder", verifyToken, orderController.sendOrderByAdmin)
    this.router.post('/confirm', verifyToken, orderController.confirmOrderByCust);

    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new OrderRouter()
