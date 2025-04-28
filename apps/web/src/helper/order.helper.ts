import { ITransaction } from "@/interface/transaction.interface"
import { apiRequest } from '@/helper/api.helper'
import { IFilterOrder, IFilterTransactions } from "@/interface/filter.interface"
import { IOrder } from "@/interface/order.interface"

export const getDataOrderAPI = async (apiRouter: string, payload: IFilterOrder) => {
    const response = await apiRequest(apiRouter, 'GET', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json" })
    return response
}

export const confirmOrderAPI = async (apiRouter: string, payload: { "orderId": string }) => {
    const response = await apiRequest(apiRouter, 'POST', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json" })
    return response
}

export const syncOrderDataFromAPI = (data: any) => {

    const orderResponse: IOrder[] = data;
    if (!orderResponse || orderResponse.length === 0) return []
    const orderData: IOrder[] = []

    orderResponse.map((item: any) => {
        const order: IOrder = {
            id: item['id'],
            created_at: item['created_at'],
            deleted_at: item['deleted_at'],
            discount_code: item['discount_code'],
            discounted: item['discounted'],
            price_per_product: item['price_per_product'],
            product_name: item['products']['name'],
            quantity: item['quantity'],
            shipping_cost: item['shipping_cost'],
            status: item['status'],
            sub_total: item['sub_total']

        };
        orderData.push({ ...order });
    });
    console.log("orderData", orderData);
    return orderData
}
