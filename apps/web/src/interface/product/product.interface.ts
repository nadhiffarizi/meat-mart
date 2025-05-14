import { IStock } from '../stock/stocks.interface';

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  weight: number;
  availableStocks: IStock[];
}

import { IGetProductCategory } from './productCategory.interface';
import { IGetProductPictures } from './productPictures.interface';
import { IGetStocks } from '../stock/stocks.interface';
import IGetProductCategory from "../product/productCategory.interface";
import { IGetProductPictures } from "../product/productPictures.interface";
import { IGetStocks } from "../stock/stocks.interface";


export default interface IGetDashboardProducts {
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
import IStock from "../stock/stocks.interface"

export default interface IProduct {
  id: string
  name: string
  slug: string
  price: number
  weight: number
  image?: string
  availableStocks: IStock[]
}
