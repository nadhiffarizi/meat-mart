import { IGetDashboardProducts } from './product.dashboard.interface';

export interface IGetStocks {
  id: string;
  product_id: string;
  store_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  products: IGetDashboardProducts;
}
