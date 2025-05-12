export default interface IStock {
  id: string;
  quantity: number;
  stores: {
    store_id: string;
    status: string;
    distance: number;
  };
}

import { IGetDashboardProducts } from './product.interface';

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

export interface IGetAllStockSummary {
  product_id: string;
  name: string;
  quantity: number;
  final_stock: number;
}
