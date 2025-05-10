import { IGetDashboardProducts } from './product.dashboard.interface';

export interface IGetStockHistory {
  id: string;
  product_id: string;
  store_id: string;
  quantity: number;
  status: 'ADD' | 'SUBTRACT' | 'SNAPSHOT';
  products: IGetDashboardProducts;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface IGetStockHistoryRange {
  earliestRecord: IGetStockHistory;
  latestRecord: IGetStockHistory;
}
