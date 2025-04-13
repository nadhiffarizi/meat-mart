export interface IDiscount {
    id: string;
    product_id: string;
    store_id: string;
    start_date: Date;
    end_date: Date;
    discount_code: string;
    promotion_type: string;
    discount_amount?: number
    discount_percentage?: number
    maximum_discount_amount?: number
    minimum_purchase?: number
    is_valid: boolean;

}