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
