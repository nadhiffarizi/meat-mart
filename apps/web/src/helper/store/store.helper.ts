import { apiRequest } from "../api.helper"

export const getStoreByAdmin = async (apiRouter: string, token: string) => {
    const response = await apiRequest(apiRouter, 'GET', undefined, { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${token}` })
    return response
}