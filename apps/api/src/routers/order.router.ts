import orderController from '@/controllers/order.controller';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT 

    this.router.get('/list', orderController.getOrderListUser);
    this.router.get('/admin/list', orderController.getOrderListAdmin);
    this.router.post('/admin/cancel', orderController.cancelOrderByAdmin);
    this.router.post("/admin/sendorder", orderController.sendOrderByAdmin)
    this.router.post('/customer/confirm', orderController.confirmOrderByCust);

    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new OrderRouter()
