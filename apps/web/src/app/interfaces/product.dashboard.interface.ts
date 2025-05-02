import IProductCategory from './productCategory.interface';

export interface IGetDashboardProducts {
  id: string;
  name: string;
  slug: string;
  price: number;
  weight: number;
  ProductCategory: IProductCategory[];
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}
