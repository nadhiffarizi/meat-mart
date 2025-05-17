export interface ICheckout {
    cart: boolean,
    payment: boolean,
    success: boolean,
}

export interface IOrderInput {
    cartId: string,
    discountId?: string,
}