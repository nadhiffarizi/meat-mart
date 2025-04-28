import { ITransaction } from "@/interface/transaction.interface"
import { apiRequest } from '@/helper/api.helper'
import { IFilterTransactions } from "@/interface/filter.interface"

export const getDataTransactionAPI = async (apiRouter: string, payload: IFilterTransactions) => {
    const response = await apiRequest(apiRouter, 'GET', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json" })
    return response
}

export const cancelTransactionAPI = async (apiRouter: string, payload: { "userId": string, "trxId": string }) => {
    const response = await apiRequest(apiRouter, 'POST', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json" })
    return response
}

export const syncTransactionDataFromAPI = (data: any) => {

    const transactionResponse: ITransaction[] = data;
    if (!transactionResponse || transactionResponse.length === 0) return []
    const transactionData: ITransaction[] = []

    transactionResponse.map((item: any) => {
        const trx: ITransaction = {
            id: item['id'],
            total_price: item['total_price'],
            deadline_payment: item['deadline_payment'],
            transaction_status: item["transaction_status"],
            invoice_number: item['invoice_number'],
            payment_proof: item['payment_proof'],
            users_id: item['users_id'],
            payment_method: item['payment_method'],
            created_at: item['created_at'],
            deleted_at: item['deleted_at'],
            updated_at: item['updated_at'],
        };
        transactionData.push({ ...trx });
    });
    console.log(transactionData);
    return transactionData
}
