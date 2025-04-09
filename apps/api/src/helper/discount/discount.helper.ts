import { ICart, ICartAfterDIsc } from "@/interface/cart.interface"
import { IDiscount } from "@/interface/discount.interface"
import prisma from "@/prisma"
import { E_PromotionType } from "@prisma/client"
import { findStockById } from "../stock/stock.helper"

export const findDiscountByCode = async (discountCode: string) => {

    const discount = await prisma.discounts.findUnique({
        where: {
            discount_code: discountCode,
            AND: {
                is_valid: true
            }
        }
    })

    return discount
}

export const calculateAfterDisc = (defaultPricePerProduct: number, promotionType: E_PromotionType, discount: IDiscount, existingCart?: ICart, subtotal?: number): ICartAfterDIsc | undefined | number => {
    switch (promotionType) {
        case E_PromotionType.CUSTOM:
            const cartAfterDisc1 = priceAfterCustomDisc(defaultPricePerProduct, discount)
            return cartAfterDisc1
            break;
        case E_PromotionType.BOGO:
            const cartAfterDisc2 = processBOGODisc(defaultPricePerProduct, existingCart!)
            return cartAfterDisc2
            break;
        case E_PromotionType.MINIMUM_BUY:
            const cartAfterDisc3 = priceAfterMinBuy(defaultPricePerProduct, discount, existingCart!)
            return cartAfterDisc3
            break;
    }
}

export const priceAfterCustomDisc = (defaultPricePerProduct: number, discount: IDiscount, existingCart?: ICart) => {
    if (discount.discount_amount) {
        /** discount based on amount per product -> times qtty in cart*/
        /** price after discount cannot <=0 because configured per product */
        let pricePerProductAfterDisc = defaultPricePerProduct - discount.discount_amount
        const feedBackDiscount: ICartAfterDIsc = {
            cart: existingCart!,
            subtotalPrice: pricePerProductAfterDisc * existingCart?.quantity!,
            pricePerProduct: pricePerProductAfterDisc
        }
        return feedBackDiscount
    } else if (discount.discount_percentage) {
        /** discount based on % per product -> times qtty in cart*/
        /** price after discount cannot <=0 because configured per product */
        const amountDiscounted = discount.discount_percentage * 0.01 * defaultPricePerProduct
        let pricePerProductAfterDisc = defaultPricePerProduct - amountDiscounted
        const feedBackDiscount: ICartAfterDIsc = {
            cart: existingCart!,
            subtotalPrice: pricePerProductAfterDisc * existingCart?.quantity!,
            pricePerProduct: pricePerProductAfterDisc
        }
        return feedBackDiscount
    } else {
        const feedBackDiscount: ICartAfterDIsc = {
            cart: existingCart!,
            subtotalPrice: defaultPricePerProduct * existingCart?.quantity!,
            pricePerProduct: defaultPricePerProduct
        }
        return feedBackDiscount
    }

}

export const processBOGODisc = (defaultPricePerProduct: number, existingCart: ICart) => {
    /** returns new cart with quantity + 1 for every current item */

    // get current cart item, assign to temp cart
    const tempCart = { ...existingCart }
    tempCart.quantity = existingCart.quantity * 2
    const feedBackDiscount: ICartAfterDIsc = {
        cart: tempCart,
        subtotalPrice: defaultPricePerProduct * existingCart.quantity,
        pricePerProduct: defaultPricePerProduct
    }
    return feedBackDiscount
}

export const priceAfterMinBuy = (defaultPricePerProduct: number, discount: IDiscount, existingCart: ICart) => {

    /**returns new cart with minimum total buy discount */
    const totalDefaultPrice = defaultPricePerProduct * existingCart.quantity

    if (discount.discount_amount && totalDefaultPrice >= discount.minimum_purchase!) {
        // using discounted amount
        let totalPriceAfterDisc = totalDefaultPrice - discount.discount_amount
        if (totalPriceAfterDisc < 0) {
            totalPriceAfterDisc = 0
        }

        const pricePerProduct = totalPriceAfterDisc / existingCart.quantity

        const feedBackDiscount: ICartAfterDIsc = {
            cart: existingCart,
            subtotalPrice: totalPriceAfterDisc,
            pricePerProduct: pricePerProduct
        }

        return feedBackDiscount
    } else if (discount.discount_percentage && totalDefaultPrice >= discount.minimum_purchase!) {
        // using discounted percentage
        let amountDiscounted = 0.01 * discount.discount_percentage!
        if (amountDiscounted < discount.maximum_discount_amount!) {
            amountDiscounted = discount.maximum_discount_amount!
        }
        let totalPriceAfterDisc = totalDefaultPrice - amountDiscounted

        const pricePerProduct = totalPriceAfterDisc / existingCart.quantity

        const feedBackDiscount: ICartAfterDIsc = {
            cart: existingCart,
            subtotalPrice: totalPriceAfterDisc,
            pricePerProduct: pricePerProduct
        }
        return feedBackDiscount

    } else {
        const feedBackDiscount: ICartAfterDIsc = {
            cart: existingCart,
            subtotalPrice: defaultPricePerProduct * existingCart.quantity,
            pricePerProduct: defaultPricePerProduct
        }
        return feedBackDiscount
    }
}

export const findDiscountByStockId = async (stockId: string, existingCart: ICart) => {
    // find stock by id
    const stock = await findStockById(stockId)

    if (!stock) return null

    console.log(stock.product_id, stock.store_id);

    const discountNonBOGO = await prisma.discounts.findMany({
        where: {
            AND: {
                product_id: stock.product_id,
                store_id: stock.store_id,
                is_valid: true,
                promotion_type: {
                    in: [E_PromotionType.CUSTOM, E_PromotionType.MINIMUM_BUY]
                }
            }
        }
    })

    const discountBOGO = await prisma.discounts.findMany({
        where: {
            promotion_type: {
                in: [E_PromotionType.BOGO]
            },
            stores: {
                Stocks: {
                    every: {
                        id: stock.id,
                        quantity: {
                            lte: existingCart.quantity * 2
                        }
                    }
                }
            }
        }
    })

    const discountAvailable = [...discountNonBOGO, ...discountBOGO]

    return discountAvailable
}
