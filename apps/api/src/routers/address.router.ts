import addressController from '@/controllers/address.controller';
import { Router } from 'express';

export class AddressRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/get', addressController.getAddressByEmail);
    this.router.post('/', addressController.addFirstAddress);
    this.router.patch('/:id', addressController.updateAddress);
    this.router.delete('/:id', addressController.deleteAddress);
    this.router.patch('/:id/primary', addressController.updateIsSelected);
  }

  getRouter(): Router {
    return this.router;
  }
}

export default new AddressRouter();
