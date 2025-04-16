export interface ICheckout {
    cart: boolean,
    address: boolean,
    payment: boolean,
    success: boolean,
}

export interface IOrderInput {
    cartId: string,
    discountId?: string
}