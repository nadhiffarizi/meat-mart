import { apiRequest } from "../api.helper"

export const cartTotalPageAPI = async (apiRoute: string, token: string) => {
    const response = apiRequest(apiRoute, 'GET', undefined, { "Content-Type": "application/json", 'Accept': 'application/json', "Authorization": `Bearer ${token}` })
    return response
}