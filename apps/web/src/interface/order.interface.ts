import IProduct from "./product.interface";

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