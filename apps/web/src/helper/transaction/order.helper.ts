import { ITransaction } from "@/interface/transaction/transaction.interface"
import { apiRequest } from '@/helper/api.helper'
import { IOrder } from "@/interface/transaction/order.interface"
import { IFilterOrder } from "@/interface/dashboard/filter.interface"

export const getDataOrderAPI = async (apiRouter: string, payload: IFilterOrder, token: string) => {
    const response = await apiRequest(apiRouter, 'GET', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` })
    return response
}

export const confirmOrderAPI = async (apiRouter: string, payload: { "orderId": string }, token: string) => {
    const response = await apiRequest(apiRouter, 'POST', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` })
    return response
}

export const cancelOrderAPI = async (apiRouter: string, payload: { "orderId": string }, token: string) => {
    const response = await apiRequest(apiRouter, 'POST', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` })
    return response
}

export const sendOrderAPI = async (apiRouter: string, payload: { "orderId": string }, token: string) => {
    const response = await apiRequest(apiRouter, 'POST', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` })
    return response
}

export const syncOrderDataFromAPI = (data: any) => {

    const orderResponse: IOrder[] = data;
    if (!orderResponse || orderResponse.length === 0) return []
    const orderData: IOrder[] = []

    orderResponse.map((item: any) => {
        const fetchedProduct = item['product']

        const order: IOrder = {
            id: item['id'],
            created_at: item['created_at'],
            deleted_at: item['deleted_at'],
            discount_code: item['discount_code'],
            discounted: item['discounted'],
            price_per_product: item['price_per_product'],
            product: { ...item['product'] },
            quantity: item['quantity'],
            shipping_cost: item['shipping_cost'],
            status: item['status'],
            sub_total: item['sub_total'],
            invoice_number: item['invoice_number'] ? item['invoice_number'] : undefined,
            product_name: item['product_name'] ? item['product_name'] : undefined
        };
        orderData.push({ ...order });

    });
    // console.log("orderData", orderData);

    return orderData
}
