import { statusEnum } from "@/enums/statusEnum.enums";
import { countDistance, xDistancePrisma } from "@/helper/location/distance.helper";
import ILocation from "@/interface/location.interface";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import prisma from "@/prisma";
import { Request } from "express";
import { findStocksByProduct } from "@/helper/stock/stock.helper";

class ProductService {
    async getProducts(req: Request) {
        try {
            const loc1: ILocation = {
                lat: "-6.2263977",
                lon: "106.8584389"
            }
            const products = await xDistancePrisma(loc1).products.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    price: true,
                    weight: true,
                    created_at: true,
                    updated_at: true,
                    deleted_at: true,
                    Stocks: {
                        select: {
                            id: true,
                            quantity: true,
                            stores: {
                                select: {
                                    id: true,
                                    status: true,
                                    distance: true
                                }
                            }
                        }
                    }
                }
            })


            for (let product of products) {
                product.Stocks = [...await findStocksByProduct(product.id, loc1)]
            }

            const feedback: serviceFeedback = {
                code: 200,
                data: products,
                status: statusEnum.SUCCESS,
                message: "get products success"
            }
            return feedback

        } catch (error) {
            const feedback: serviceFeedback = {
                code: 400,
                data: null,
                status: statusEnum.FAILED,
                message: "failed getting products"
            }
            return feedback
        }
    }
}

export default new ProductService()
