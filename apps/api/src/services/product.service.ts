import { statusEnum } from "@/enums/statusEnum.enums";
import { xDistancePrisma } from "@/helper/location/distance.helper";
import ILocation from "@/interface/location.interface";
import { Request } from "express";
import { findStocksByProduct } from "@/helper/stock/stock.helper";
import { returnServiceFeedback } from "@/helper/responseHandler.helper";

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
                }
            })
            const data: any[] = []

            for (let product of products) {
                const availableStocks = await findStocksByProduct(product.id, loc1)
                const temp = { ...product, ...{ "availableStocks": availableStocks } }
                data.push({ ...temp })
            }

            return returnServiceFeedback(200, data, statusEnum.SUCCESS, "get product success")
        } catch (error) {
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get product failed")
        }
    }
}
export default new ProductService()
