import { statusEnum } from "@/enums/statusEnum.enums";
import { cancelOrderById, confirmOrderById, updateOrderDetails } from "@/helper/order/order.helper";
import { returnServiceFeedback } from "@/helper/responseHandler.helper";
import { trxUpdateByOrderConfirm } from "@/helper/transaction/transaction.helper";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { E_OrderStatus } from "@prisma/client";
import { Request } from "express";

class OrderService {

    async cancelOrderByAdmin(req: Request) {

        const { trxDetailId, stockId } = req.body

        try {
            // cancel order
            const canceledOrder = await cancelOrderById(trxDetailId)
            // feedback from service
            return returnServiceFeedback(200, canceledOrder, statusEnum.SUCCESS, "cancel order by admin success")
        } catch (error) {
            // feedback from service
            return returnServiceFeedback(406, (error as Error).message, statusEnum.FAILED, "cancel order by admin failed")
        }


    }

    async confirmOrderByCust(req: Request) {

        const { trxDetailId } = req.body
        try {
            const order = await confirmOrderById(trxDetailId)

            // update trx
            const trxUpdated = await trxUpdateByOrderConfirm(order.transaction_id)
            // feedback from service
            return returnServiceFeedback(200, trxUpdated, statusEnum.SUCCESS, "confirm order by customer success")
        } catch (error) {
            // feedback from service
            return returnServiceFeedback(406, (error as Error).message, statusEnum.FAILED, "confirm order by customer failed")
        }

    }

    async sendOrderByAdmin(req: Request) {

        const { trxDetailIds } = req.body
        try {
            const updatedOrders: any[] = []
            for (let id of (trxDetailIds as string[])) {
                let updatedOrder = await updateOrderDetails(id, E_OrderStatus.ON_DELIVERY)
                updatedOrders.push(updatedOrder)
            }
            // feedback from service
            return returnServiceFeedback(200, updatedOrders, statusEnum.SUCCESS, "send order by admin success")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(406, (error as Error).message, statusEnum.FAILED, "send order by admin failed")

        }


    }

}

export default new OrderService()
