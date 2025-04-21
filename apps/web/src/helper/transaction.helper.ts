import { apiRequest } from "./api.helper"

export const getDataTransactionAPI = async (apiRouter: string, payload: any) => {
    const response = await apiRequest(apiRouter, 'GET', { ...payload }, { "Content-Type": "application/json", "Accept": "application/json" })
    return response
}