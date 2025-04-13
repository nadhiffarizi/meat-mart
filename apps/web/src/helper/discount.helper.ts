import { IDiscount } from "@/interface/discount.interface"
import { apiRequest } from "./api.helper"

export const getAvailableDiscountsAPI = async (apiRouter: string) => {
    const response = await apiRequest(apiRouter, 'GET', { "Content-Type": "application/json", "Accept": "application/json" })
    return response
}

export const redeemDiscountAPI = async (apiRouter: string, payload: { cartId: string, discountCode: string }) => {
    const response = await apiRequest(apiRouter, 'POST', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json" })
    return response
}

export const syncDiscountDataFromAPI = (data: any) => {

    const discountsResponse: IDiscount[] = data;
    const myDiscountOptions: IDiscount[] = [];
    discountsResponse.map((item: any) => {
        const discountOptions: IDiscount = {
            id: item['id'],
            product_id: item['product_id'],
            store_id: item['store_id'],
            start_date: item["start_date"],
            end_date: item['end_date'],
            discount_code: item['discount_code'],
            promotion_type: item['promotion_type'],
            discount_amount: item['discount_item'],
            discount_percentage: item['discount_percentage'],
            maximum_discount_amount: item['maximum_discount_amount'],
            minimum_purchase: item['minimum_purchase'],
            is_valid: item['is_valid']
        };
        myDiscountOptions.push({ ...discountOptions });
    });
    console.log(myDiscountOptions);
    return myDiscountOptions
}