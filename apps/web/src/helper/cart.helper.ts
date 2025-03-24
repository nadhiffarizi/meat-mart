"use server"
import IProduct from "@/interface/product.interface";
import { apiRequest } from "./api.helper";

export const addToCart = async (apiRoute: string, productId: string) => {
    const response = await apiRequest(apiRoute, 'POST', { productId: productId })

    console.log(await response.json());

}