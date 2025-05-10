import { statusEnum } from "@/enums/statusEnum.enums";
import ILocation from "@/interface/location.interface";
import { Request } from "express";
import { findStockByCartId, findStocksByProduct } from "@/helper/stock/stock.helper";
import { calculateAfterDisc, findDiscountByCode, findDiscountById, findDiscountsByStockId } from "@/helper/discount/discount.helper";
import { findCartById } from "@/helper/cart/cart.helper";
import { findProductByStockId } from "@/helper/product/product.helper";
import { ICart, ICartAfterDIsc } from "@/interface/cart.interface";
import { returnServiceFeedback } from "@/helper/responseHandler.helper";
import { convertRoleToEnum } from "@/helper/role.helper";
import { E_Role } from "@prisma/client";
import { IDiscount } from "@/interface/discount.interface";

class DiscountService {
    async getDiscounts(req: Request) {
        /** get discount by stockId*/
        const user = req.user
        // need info: userId, cartId
        const { cartId } = req.params

        try {
            const role = convertRoleToEnum(user?.role!)
            if (role !== E_Role.CUSTOMER) throw new Error("Unauthorized role")

            // placeholder for location 
            const loc1: ILocation = {
                lat: "-6.2263977",
                lon: "106.8584389"
            }
            // find stockId by cartId
            const stockId = await findStockByCartId(cartId)

            // find cart by id
            const cart = await findCartById(cartId)

            // find discount by stockId
            const data = await findDiscountsByStockId(stockId.stock_id!, cart!)
            // feedback from service

            return returnServiceFeedback(200, data, statusEnum.SUCCESS, "get discount success")

        } catch (error) {
            // feedback from service

            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get discount failed")
        }
    }

    async redeemDiscount(req: Request) {
        /**give feedback to FE {discountedAmount, subtotalAfterDiscount} */
        const user = req.user
        // input data
        const { cartId, discountId } = req.body

        try {
            const role = convertRoleToEnum(user?.role!)
            if (role !== E_Role.CUSTOMER) throw new Error("Unauthorized role")

            // if data not completed, failed
            if (!cartId || !discountId) throw new Error("Discount Id not completed")

            // get dicount data
            const discount = await findDiscountById(discountId!)

            // get cartData
            const cartData = await findCartById(cartId)

            // get product price
            const product = await findProductByStockId(cartData?.stock_id!)

            // get discounted of subtotal cartitem
            const discountedCartItem = calculateAfterDisc(product.products?.price!, discount?.promotion_type!, (discount as IDiscount)!, cartData as ICart) as ICartAfterDIsc

            // feedback from service
            return returnServiceFeedback(200, { discount, ...discountedCartItem }, statusEnum.SUCCESS, "redeem discount success")

        } catch (error) {
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "redeem discounted failed")

        }

    }

}

export default new DiscountService()
