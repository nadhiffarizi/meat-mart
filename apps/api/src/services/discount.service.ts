import { statusEnum } from "@/enums/statusEnum.enums";
import ILocation from "@/interface/location.interface";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { Request } from "express";
import { findStockByCartId, findStocksByProduct } from "@/helper/stock/stock.helper";
import { calculateAfterDisc, findDiscountByCode, findDiscountByStockId } from "@/helper/discount/discount.helper";
import { findCartById } from "@/helper/cart/cart.helper";
import { findProductByStockId } from "@/helper/product/product.helper";
import { ICartAfterDIsc } from "@/interface/cart.interface";

class DiscountService {
    async getDiscounts(req: Request) {
        /** get discount by stockId*/

        // placeholder for location 
        const loc1: ILocation = {
            lat: "-6.2263977",
            lon: "106.8584389"
        }

        // need info: userId, cartId
        const { cartId } = req.body

        // find stockId by cartId
        const stockId = await findStockByCartId(cartId)

        // find cart by id
        const cart = await findCartById(cartId)

        // find discount by stockId
        const data = await findDiscountByStockId(stockId.stock_id!, cart!)
        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: data,
            status: statusEnum.SUCCESS,
            message: "get discount success"
        }
        return feedback
    }

    async redeemDiscount(req: Request) {
        /**give feedback to FE {discountedAmount, subtotalAfterDiscount} */

        // input data
        const { cartId, discountCode } = req.body

        // if data not completed, failed
        // if (!cartId || !discountCode) throw new Error("input data not completed")

        // get dicount data
        const discount = await findDiscountByCode(discountCode!)

        // get cartData
        const cartData = await findCartById(cartId)

        // get product price
        const product = await findProductByStockId(cartData?.stock_id!)

        // get discounted of subtotal cartitem
        const discountedCartItem = calculateAfterDisc(product.products?.price!, discount?.promotion_type!, discount!) as ICartAfterDIsc

        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: discountedCartItem,
            status: statusEnum.SUCCESS,
            message: "redeem discount success"
        }
        return feedback

    }

}

export default new DiscountService()
