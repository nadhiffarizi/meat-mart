import { createContext } from "react";
import { IFilterOrder } from "../dashboard/filter.interface";
import { IProduct } from "../product/product.interface";

export interface IOrder {
    id: string,
    created_at: string,
    deleted_at: string | null,
    discount_code: string | null,
    discounted: boolean,
    price_per_product: number,
    sub_total: number,
    product_name?: string,
    invoice_number?: string,
    product: IProduct
    status: string,
    quantity: number,
    shipping_cost: number,
}

// filter context type
export interface OrderFilterContextType {
    filterOrder: IFilterOrder | undefined;
    setFilterOrder: (filter: IFilterOrder | undefined) => void;
}

export const OrderFilterContext = createContext<
    OrderFilterContextType | undefined
>(undefined);

// order status change context type
export interface IOrderChangeContextType {
    isChange: boolean | undefined;
    setChange: (isChange: boolean | undefined) => void;
}
export const OrderChangeContext = createContext<
    IOrderChangeContextType | undefined
>(undefined);