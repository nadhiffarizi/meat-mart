import { findDiscountByCode } from "@/helper/discount/discount.helper";
import { E_PromotionType } from "@prisma/client";

export interface IDiscount {
    id: string;
    product_id: string;
    store_id: string;
    start_date: Date;
    end_date: Date;
    discount_code: string;
    promotion_type: E_PromotionType;
    discount_amount: number | null;
    discount_percentage: number | null;
    maximum_discount_amount: number | null;
    minimum_purchase: number | null;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null | undefined;
    is_valid: boolean;

}
