import { statusEnum } from "@/enums/statusEnum.enums";
import { deleteCart, disableCart, findCartById, findCartByIds, findCartByOrderInput } from "@/helper/cart/cart.helper";
import { updateCartToOrder, updateOrderDetails } from "@/helper/order/order.helper";
import { returnServiceFeedback } from "@/helper/responseHandler.helper";
import { cancelTransaction, createDefaultTrxId, createTransaction, createTrxDetails, getTrxById, updateTrxStatus } from "@/helper/transaction/transaction.helper";
import { ICart } from "@/interface/cart.interface";
import ILocation from "@/interface/location.interface";
import { IOrderInput } from "@/interface/order.interface";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { E_OrderStatus, E_TransactionStatus } from "@prisma/client";
import { Request } from "express";

class TransactionService {
    async create(req: Request) {

        try {
            const { userId, orderInputs } = req.body

            // placeholder for location 
            const loc1: ILocation = {
                lat: "-6.2263977",
                lon: "106.8584389"
            }

            // find carts data
            const carts = await findCartByOrderInput(orderInputs as IOrderInput[], userId)

            // update cart to order
            const filteredCarts = await updateCartToOrder(carts as ICart[], userId, loc1)

            // recap trxdetails & trx
            const trxDetails = []
            let trx = {}

            if (filteredCarts.notEligibleCart.length !== 0) {
                // feedback from service
                return returnServiceFeedback(406, filteredCarts.notEligibleCart, statusEnum.FAILED, "Transaction failed to create, there are insufficient stock in some of your carts")

            } else {
                // create default transaction record 
                const trxId = await createDefaultTrxId(userId)

                // set total price 
                let totalPrice = 0

                // create order details
                for (let i = 0; i < filteredCarts.eligibleCart.length; i++) {
                    let cartItem = filteredCarts.eligibleCart[i]
                    const trxDetail = await createTrxDetails(trxId, cartItem, loc1, (orderInputs as IOrderInput[])[i])
                    trxDetails.push(trxDetail)
                    totalPrice += (trxDetail.sub_total + trxDetail.shipping_cost) // total price for one cart item

                    // delete cart
                    await deleteCart(cartItem.id)
                }

                // update transaction table
                const newTrx = await createTransaction(trxId, totalPrice, userId)
                trx = { ...newTrx }
            }

            // get cart
            const cartAfterCheckout = await findCartByIds(carts?.map((cart) => cart.id)!)

            // feedback from service
            return returnServiceFeedback(200, { cartAfterCheckout, trx }, statusEnum.SUCCESS, "transaction created successfully")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "create transaction failed")
        }


    }

    async cancel(req: Request) {
        const { userId, trxId } = req.body

        try {
            const canceledTrx = await cancelTransaction(userId, trxId)
            // feedback from service
            return returnServiceFeedback(200, canceledTrx, statusEnum.SUCCESS, "cancel transaction success")
        } catch (error) {
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "cancel transaction failed")
        }
    }

    async confirmTrxByAdmin(req: Request) {

        const { trxId } = req.body


        // change status trx
        const updatedTrx = await updateTrxStatus(trxId!, E_TransactionStatus.CONFIRMED_ADMIN)

        // change status for trxIds
        const updatedTrxDetails = await updateOrderDetails(updatedTrx.id, E_OrderStatus.ON_PROCESS)

        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: { updatedTrx, updatedTrxDetails },
            status: statusEnum.SUCCESS,
            message: "transaction confirm success"
        }
        return feedback
    }

    async rejectTrxByAdmin(req: Request) {
        const { trxId } = req.body

        // change status trx
        const updatedTrx = await updateTrxStatus(trxId!, E_TransactionStatus.AWAITING_PAYMENT)

        // change status for trxIds
        const updatedTrxDetails = await updateOrderDetails(updatedTrx.id, E_OrderStatus.AWAITING_PAYMENT)

        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: { updatedTrx, updatedTrxDetails },
            status: statusEnum.SUCCESS,
            message: "transaction rejected success"
        }
        return feedback
    }

    async uploadTrxProof(req: Request) {

        // const { image } = req.file;

        const feedback: serviceFeedback = {
            code: 200,
            data: req.file?.mimetype.split("/")[1],
            status: statusEnum.SUCCESS,
            message: "upload trx proof success"
        }

        return feedback
    }
}

export default new TransactionService()
