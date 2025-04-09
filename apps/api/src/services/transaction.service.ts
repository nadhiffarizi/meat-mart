import { statusEnum } from "@/enums/statusEnum.enums";
import { findCartByOrderInput } from "@/helper/cart/cart.helper";
import { updateCartToOrder, updateOrderDetails } from "@/helper/order/order.helper";
import { cancelTransaction, createDefaultTrxId, createTransaction, createTrxDetails, getTrxById, updateTrxStatus } from "@/helper/transaction/transaction.helper";
import { ICart } from "@/interface/cart.interface";
import ILocation from "@/interface/location.interface";
import { IOrderInput } from "@/interface/order.interface";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { E_OrderStatus, E_TransactionStatus } from "@prisma/client";
import { Request } from "express";

class TransactionService {
    async create(req: Request) {

        const { userId, orderInput } = req.body

        // placeholder for location 
        const loc1: ILocation = {
            lat: "-6.2263977",
            lon: "106.8584389"
        }

        // find carts data
        const carts = await findCartByOrderInput(orderInput as IOrderInput[], userId)

        // update cart to order
        const filteredCarts = await updateCartToOrder(carts as ICart[], userId, loc1)

        // recap trxdetails & trx
        const trxDetails = []
        let trx = {}

        if (filteredCarts.notEligibleCart.length !== 0) {
            // feedback from service
            const feedback: serviceFeedback = {
                code: 200,
                data: filteredCarts,
                status: statusEnum.SUCCESS,
                message: "order created success"
            }
            return feedback
        } else {
            // create default transaction record 
            const trxId = await createDefaultTrxId(userId)

            // set total price 
            let totalPrice = 0

            // create order details
            for (let cart of filteredCarts.eligibleCart) {
                const trxDetail = await createTrxDetails(trxId, cart, orderInput, loc1)
                trxDetails.push(trxDetail)
                totalPrice += (trxDetail.sub_total + trxDetail.shipping_cost) // total price for one cart item
            }

            // update transaction table
            const newTrx = await createTransaction(trxId, totalPrice, userId)
            trx = { ...newTrx }

        }

        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: { trxDetails, trx },
            status: statusEnum.SUCCESS,
            message: "order created success"
        }
        return feedback
    }

    async cancel(req: Request) {
        const { userId, trxId } = req.body

        const canceledTrx = await cancelTransaction(userId, trxId)
        // feedback from service
        const feedback: serviceFeedback = {
            code: 200,
            data: canceledTrx,
            status: statusEnum.SUCCESS,
            message: "transaction canceled success"
        }
        return feedback
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
