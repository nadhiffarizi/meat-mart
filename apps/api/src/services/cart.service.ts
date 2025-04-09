import { statusEnum } from "@/enums/statusEnum.enums";
import { addToCart, subtractCart } from "@/helper/cart/cart.helper";
import { xDistancePrisma } from "@/helper/location/distance.helper";
import ILocation from "@/interface/location.interface";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import prisma from "@/prisma";
import { Request } from "express";
import { findStocksByProduct } from "@/helper/stock/stock.helper";

class CartService {
    async add(req: Request) {

        // placeholder for location 
        const loc1: ILocation = {
            lat: "-6.2263977",
            lon: "106.8584389"
        }

        // need info: user, address(location), productId
        const { quantity, productId, userId } = req.body


        // check if existed in the carts table
        const findItem = await prisma.carts.findFirst({
            where: {
                user_id: userId,
                AND: {
                    stocks: {
                        product_id: productId
                    }
                }
            }
        })

        const availableStocks = await findStocksByProduct(productId, loc1)
        // console.log("product id", productId);

        const insertedData = await addToCart(availableStocks, Number(quantity), userId, findItem!)


        const data = await prisma.carts.findMany({
            where: {
                user_id: userId
            }
        })

        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: data,
            status: statusEnum.SUCCESS,
            message: "add cart success"
        }
        return feedback
        // try {

        // } catch (error) {
        //     // feedback from service
        //     const feedback: serviceFeedback = {
        //         code: 400,
        //         data: null,
        //         status: statusEnum.FAILED,
        //         message: (error as Error).message
        //     }
        //     return feedback
        // }
    }

    async getCart(req: Request) {
        try {
            const { userId } = req.body

            const loc1: ILocation = {
                lat: "-6.2263977",
                lon: "106.8584389"
            }

            const cartData = await xDistancePrisma(loc1).carts.findMany({
                select: {
                    id: true,
                    user_id: true,
                    stocks: {
                        select: {
                            id: true,
                            quantity: true,
                            products: true,
                            stores: {
                                select: {
                                    id: true,
                                    status: true,
                                    distance: true
                                }
                            }
                        }
                    },
                    quantity: true,
                    created_at: true,
                    updated_at: true,
                    deleted_at: true

                },
                where: {
                    user_id: userId
                }
            })

            // feedback from service
            const feedback: serviceFeedback = {
                code: 200,
                data: cartData,
                status: statusEnum.SUCCESS,
                message: "get cart success"
            }
            return feedback

        } catch (error) {
            // feedback from service
            const feedback: serviceFeedback = {
                code: 400,
                data: null,
                status: statusEnum.FAILED,
                message: (error as Error).message
            }
            return feedback
        }
    }

    async subtract(req: Request) {
        try {
            // placeholder for location
            const loc1: ILocation = {
                lat: "-6.2263977",
                lon: "106.8584389"
            }

            // need info: user, address(location), productId
            const { quantity, productId, userId } = req.body

            // check where is the cart data
            const findItem = await prisma.carts.findFirst({
                where: {
                    user_id: userId,
                    AND: {
                        stocks: {
                            product_id: productId
                        }
                    }
                }
            })

            const availableStocks = await findStocksByProduct(productId, loc1)
            const data = await subtractCart(availableStocks, quantity, userId, findItem!)

            // feedback from service
            const feedback: serviceFeedback = {
                code: 200,
                data: data,
                status: statusEnum.SUCCESS,
                message: "subtract cart success"
            }
            return feedback
        } catch (error) {
            // feedback from service
            const feedback: serviceFeedback = {
                code: 400,
                data: (error as Error).message,
                status: statusEnum.FAILED,
                message: "subtract cart failed"
            }
            return feedback
        }
    }
}

export default new CartService()
