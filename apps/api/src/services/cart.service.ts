import { statusEnum } from "@/enums/statusEnum.enums";
import { addToCart, subtractCart, updateCartQuantity } from "@/helper/cart/cart.helper";
import { xDistancePrisma } from "@/helper/location/distance.helper";
import ILocation from "@/interface/location.interface";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import prisma from "@/prisma";
import { Request } from "express";
import { findStocksByProduct } from "@/helper/stock/stock.helper";
import { returnServiceFeedback } from "@/helper/responseHandler.helper";
import { findThumbnailByProductId, findThumbnailByStockId } from "@/helper/product/product.helper";

class CartService {
    async add(req: Request) {
        // placeholder for location 
        const loc1: ILocation = {
            lat: "-6.2263977",
            lon: "106.8584389"
        }

        // need info: user, address(location), productId
        const { quantity, productId, userId } = req.body

        try {
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

            const insertedData = await addToCart(availableStocks, Number(quantity), userId, findItem!)

            // feedback from service
            return returnServiceFeedback(200, insertedData, statusEnum.SUCCESS, "add cart success")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "add cart failed")
        }
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
                    quantity: true,
                    stocks: {
                        select: {
                            id: true,
                            quantity: true,

                            stores: {
                                select: {
                                    id: true,
                                    status: true,
                                    distance: true
                                }
                            },
                            products: true,
                        }
                    },
                },
                where: {
                    user_id: userId
                }, orderBy: {
                    id: "asc"
                }
            })

            for (let cartItem of cartData) {
                const availableStocks = await findStocksByProduct(cartItem.stocks.products.id, loc1)
                const productThumbnail = await findThumbnailByStockId(cartItem.stocks.id)
                cartItem.stocks.products = { ...cartItem.stocks.products, ...{ "image": productThumbnail?.link }, ...{ "availableStocks": availableStocks } }
            }
            // feedback from service
            return returnServiceFeedback(200, cartData, statusEnum.SUCCESS, "get cart success")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get cart failed")
        }
    }

    async subtract(req: Request) {
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
        return returnServiceFeedback(200, data, statusEnum.SUCCESS, "subtract cart success")

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
            return returnServiceFeedback(200, data, statusEnum.SUCCESS, "subtract cart success")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "subtract cart failed")
        }
    }

    async updateQuantity(req: Request) {
        // location placeholder
        const loc1: ILocation = {
            lat: "-6.2263977",
            lon: "106.8584389"
        }

        // need info: user, address(location), productId
        const { quantity, productId, userId } = req.body

        try {
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

            const insertedData = await updateCartQuantity(availableStocks, Number(quantity), userId, findItem!)

            // feedback from service
            return returnServiceFeedback(200, insertedData, statusEnum.SUCCESS, "add cart success")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "add cart failed")
        }
    }
}

export default new CartService()
