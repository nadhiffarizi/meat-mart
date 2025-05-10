import orderController from '@/controllers/order.controller';
import orderQueryController from '@/controllers/orderQuery.controller';
import storeQueryController, { StoreController } from '@/controllers/storeQuery.controller';
import storeController from '@/controllers/store.controller';
import { verifyToken } from '@/middleware/authorize.middleware';
import { Router } from 'express';

export class StoreRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // dont forget to include middleware function before SIT 

    this.router.get('/', verifyToken, storeQueryController.getStoreByAdmin);
    this.router.get('/all', verifyToken, storeController.getAllStores);
    this.router.get('/', verifyToken, storeController.getStore);
    // .... continue api
  }


  getRouter(): Router {
    return this.router;
  }
}

export default new StoreRouter()