import { apiRequest } from "./api.helper";

export const getProducts = async (apiRoute: string) => {
    const response = await apiRequest(apiRoute, 'GET')
    return response
}