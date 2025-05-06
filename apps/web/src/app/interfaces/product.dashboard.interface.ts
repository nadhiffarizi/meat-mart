import IGetProductCategory from './productCategory.interface';
import { IGetProductPictures } from './productPictures.interface';
import { IGetStocks } from './stock.interface';

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
