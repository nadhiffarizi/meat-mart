import IGetProductCategory from './productCategory.interface';
import { IGetProductPictures } from './productPictures.interface';

export interface IGetDashboardProducts {
  id: string;
  name: string;
  slug: string;
  price: number;
  weight: number;
  ProductCategories: IGetProductCategory[];
  ProductPictures: IGetProductPictures[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
