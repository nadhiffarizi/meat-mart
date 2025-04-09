export interface ICart {

    id: string;
    user_id: string;
    stock_id: string;
    quantity: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;

}
export interface ICartAfterDIsc {
    cart: ICart,
    subtotalPrice: number,
    pricePerProduct?: number
}