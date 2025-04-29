import { statusEnum } from "@/enums/statusEnum.enums";
import { getOrderByInvoice, getOrderByParams, getOrderbyStoresId } from "@/helper/order/orderQuery.helper";
import { returnServiceFeedback } from "@/helper/responseHandler.helper";
import { convertRoleToEnum } from "@/helper/role.helper";
import { findStoreByAdmin, findStoreBySuperAdmin } from "@/helper/store/store.helper";
import { serviceFeedback } from "@/interface/serviceFeedback.interface";
import { E_Role } from "@prisma/client";
import { Request } from "express";

class OrderService {
    async getOrderListUser(req: Request) {

        const { status, invoice, from, until } = req.query // from and until are start date and end date search range
        const { userId, role } = req.body

        try {
            // check role
            const role_ = convertRoleToEnum(role)

            if (role_ !== E_Role.CUSTOMER) throw new Error("role is customer, cannot access this service")

            let orderList: any = []

            if (invoice) {
                // get order list by invoice number
                const result = await getOrderByInvoice(userId, String(invoice))
                if (result) {
                    orderList = [...result]
                }
            } else {
                // get order list by status or date 
                orderList = [...(await getOrderByParams(userId, status as string[], from as string, until as string))]
            }

            // feedback from service
            return returnServiceFeedback(200, orderList, statusEnum.SUCCESS, "get order list success")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get order list canceled")
        }


    }

    async getOrderListAdmin(req: Request) {

        const { status, role, from, until } = req.query // from and until are start date and end date search range
        const { adminId } = req.body

        try {
            // let orderList: any = []
            if (!role) throw new Error("error, no role given")

            // check role to authorize
            const role_ = convertRoleToEnum(role as string)
            if (role_ === E_Role.CUSTOMER) throw new Error("role is customer, cannot access service")

            // find stores by admin
            const stores = role_ === E_Role.SUPER_ADMIN ? (await findStoreBySuperAdmin()) : (await findStoreByAdmin(adminId!))

            // get order by storesId
            const orderList = await getOrderbyStoresId(stores.map((store) => store.id), status as string[], from as string, until as string)

            // feedback from service
            const feedback: serviceFeedback = {
                code: 200,
                data: orderList,
                status: statusEnum.SUCCESS,
                message: "get order list success"
            }
            return feedback
        } catch (error) {
            // feedback from service
            const feedback: serviceFeedback = {
                code: 400,
                data: (error as Error).message,
                status: statusEnum.FAILED,
                message: "get order list by storeadmin failed"
            }
            return feedback
        }



    }
}

export default new OrderService()
