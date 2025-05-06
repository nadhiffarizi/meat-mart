import orderController from '@/controllers/order.controller';
import orderQueryController from '@/controllers/orderQuery.controller';
import { Router } from 'express';

export class OrderRouterQuery {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT 

    this.router.get('/', orderQueryController.getOrderListUser);
    this.router.get('/admin', orderQueryController.getOrderListAdmin);
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new OrderRouterQuery()
