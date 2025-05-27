import { IStock } from '../stock/stocks.interface';
import { IGetProductCategory } from './productCategory.interface';
import { IGetProductPictures } from '../product/productPictures.interface';
import { IGetStocks } from '../stock/stocks.interface';
import { IDiscount } from '../discount/discount.interface';

export interface IGetDashboardProducts {
  id: string;
  name: string;
  slug: string;
  price: number;
  weight: number;
  ProductCategories: IGetProductCategory[];
  ProductPictures: IGetProductPictures[];
  Stocks: IGetStocks[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface IProduct {
  id: string;
  name: string;
  Discounts?: IDiscount[];
  slug: string;
  finalPrice?: number;
  price: number;
  weight: number;
  image?: string;
  availableStocks: IStock[];
}
