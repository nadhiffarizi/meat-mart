import { ICart } from "./cart.interface";

export interface IEligibleToOrder {
    eligibleCart: ICart[],
    notEligibleCart: ICart[]
}

export interface IOrderInput {
    cartId: string
    discountId?: string
}