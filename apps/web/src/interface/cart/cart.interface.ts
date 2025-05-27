import { IDiscount } from '../discount/discount.interface';
import { IProduct } from '../product/product.interface';
import { IStock } from '../stock/stocks.interface';

export interface ICart {
  id?: string;
  Stock?: IStock;
  product: IProduct;
  quantity: number;
  discount?: IDiscount;
  subtotalPrice?: number;
  pricePerProduct?: number;
  quantityAfterDisc?: number;
}

export interface payloadCartService {
  quantity?: number;
  productId?: string;
  userId?: string;
}

export interface ICart {
  id?: string;
  Stock?: IStock;
  product: IProduct;
  quantity: number;
  discount?: IDiscount;
  subtotalPrice?: number;
  pricePerProduct?: number;
  quantityAfterDisc?: number;
  shippingCost?: number;
}

export interface payloadCartService {
  quantity?: number;
  productId?: string;
}
