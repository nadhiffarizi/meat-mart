import { IDiscount } from "./discount.interface"
import IProduct from "./product.interface"
import IStock from "./stocks.interface"

export interface ICart {
    id?: string,
    Stock?: IStock,
    product: IProduct,
    quantity: number,
    discount?: IDiscount,
    subtotalPrice?: number,
    pricePerProduct?: number,
    quantityAfterDisc?: number
}

export interface payloadCartService {
    quantity?: number,
    productId?: string,
    userId?: string,
} 