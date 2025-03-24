import { statusEnum } from "@/enums/statusEnum.enums";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import prisma from "@/prisma";
import { Request } from "express";

class ProductService {
    async getProducts(req: Request) {
        try {

            const products = await prisma.products.findMany({})

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

        // feedback from service

    }
}

export default new ProductService()
