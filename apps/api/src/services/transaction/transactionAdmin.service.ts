import { statusEnum } from "@/enums/statusEnum.enums"
import { updateOrderStatus } from "@/helper/order/order.helper"
import { getOrderByTrxId } from "@/helper/order/orderQuery.helper"
import { returnServiceFeedback } from "@/helper/responseHandler.helper"
import { getTrxById, updateTrxStatus } from "@/helper/transaction/transaction.helper"
import { getTransactionByAdmin } from "@/helper/transaction/transactionQuery.helper"
import { E_OrderStatus, E_Role, E_TransactionStatus } from "@prisma/client"
import { Request } from "express"

class TransactionServiceAdmin {


    async adminConfirm(req: Request) {

        const { trxId } = req.body
        const user = req.user
        try {
            if (user?.role === E_Role.CUSTOMER) throw new Error("Unauthorized role")
            // change status trx
            const updatedTrx = await updateTrxStatus(trxId!, user?.id!, E_TransactionStatus.CONFIRMED_ADMIN)

            // find orders
            const orders = await getOrderByTrxId(updatedTrx.id)

            const orderDetails = []
            for (let order of orders) {
                // change status for trxIds
                const updatedTrxDetails = await updateOrderStatus(order.transaction_id, E_OrderStatus.ON_PROCESS)
                orderDetails.push(updatedTrxDetails)
            }

            return returnServiceFeedback(200, { updatedTrx, orderDetails }, statusEnum.SUCCESS, "transaction confirm success")

        } catch (error) {
            return returnServiceFeedback(406, (error as Error).message, statusEnum.FAILED, "Unauthorized access. transaction confirm failed")
        }


    }

    async rejectPaymentProof(req: Request) {
        const { trxId } = req.body
        const user = req.user
        try {
            if (user?.role === E_Role.CUSTOMER) throw new Error("Unauthorized role")
            // change status trx
            const updatedTrx = await updateTrxStatus(trxId!, user?.id!, E_TransactionStatus.AWAITING_PAYMENT)

            // find orders
            const orders = await getOrderByTrxId(updatedTrx.id)

            const orderDetails = []
            for (let order of orders) {
                // change status for trxIds
                const updatedTrxDetails = await updateOrderStatus(order.transaction_id, E_OrderStatus.AWAITING_PAYMENT)
                orderDetails.push(updatedTrxDetails)
            }

            return returnServiceFeedback(200, { updatedTrx, orderDetails }, statusEnum.SUCCESS, "transaction confirm success")

        } catch (error) {
            return returnServiceFeedback(406, (error as Error).message, statusEnum.FAILED, "Unauthorized access. transaction confirm failed")
        }
    }

}

export default new TransactionServiceAdmin()