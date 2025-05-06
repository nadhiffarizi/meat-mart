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
        const user = req.user
        console.log("user id", user?.id);


        try {
            // check role
            const role = convertRoleToEnum(user?.role!)
            if (role !== E_Role.CUSTOMER) throw new Error("Unauthorized role, cannot access this service")

            let orderList: any = []

            if (invoice) {
                // get order list by invoice number
                const result = await getOrderByInvoice(user?.id!, String(invoice))
                if (result) {
                    orderList = [...result]
                }
            } else {
                // get order list by status or date 
                orderList = [...(await getOrderByParams(user?.id!, status as string[], from as string, until as string))]
                console.log(orderList);

            }

            // feedback from service
            return returnServiceFeedback(200, orderList, statusEnum.SUCCESS, "get order list success")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get order list canceled")
        }
    }

    async getOrderListAdmin(req: Request) {

        const { status, from, until } = req.query // from and until are start date and end date search range
        const user = req.user

        try {
            const role = convertRoleToEnum(user?.role!)
            if (role === E_Role.CUSTOMER) throw new Error("Unauthorized role, cannot access this service")
            // find stores by admin
            const stores = role === E_Role.SUPER_ADMIN ? (await findStoreBySuperAdmin()) : (await findStoreByAdmin(user?.id!))

            // get order by storesId
            const orderList = await getOrderbyStoresId(stores.map((store) => store.id), status as string[], from as string, until as string)

            // feedback from service
            return returnServiceFeedback(200, orderList, statusEnum.SUCCESS, "get order list by admin success")
        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get order list by aadmin failed")
        }

    }
}

export default new OrderService()
