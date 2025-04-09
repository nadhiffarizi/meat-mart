import IProduct from "./product.interface"
import IStock from "./stocks.interface"

export interface ICart {
    id?: string,
    Stock?: IStock,
    product: IProduct,
    quantity: number,
    created_at?: string,
    updated_at?: string,
    deleted_at?: string
}

export interface payloadCartService {
    quantity?: number,
    productId?: string,
    userId?: string,
} 