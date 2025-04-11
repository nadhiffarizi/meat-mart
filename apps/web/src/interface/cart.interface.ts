import IProduct from "./product.interface"
import IStock from "./stocks.interface"

export interface ICart {
    id?: string,
    Stock?: IStock,
    product: IProduct,
    quantity: number,
}

export interface payloadCartService {
    quantity?: number,
    productId?: string,
    userId?: string,
} 