import storeController from '@/controllers/store.controller';
import { Router } from 'express';

export class StoreRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/get', storeController.getStoreList);
    this.router.post('/', storeController.createStore);
    this.router.post('/:id', storeController.getStoreById);
    this.router.patch('/:id', storeController.updateStore);
    this.router.patch('/:id', storeController.daleteStore);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new StoreRouter();
