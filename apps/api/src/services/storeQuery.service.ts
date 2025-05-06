import { statusEnum } from "@/enums/statusEnum.enums"
import { returnServiceFeedback } from "@/helper/responseHandler.helper"
import { convertRoleToEnum } from "@/helper/role.helper"
import { findStoreByAdmin, findStoreBySuperAdmin } from "@/helper/store/store.helper"
import { E_Role } from "@prisma/client"
import { Request } from "express"

class StoreServiceQuery {
    async getStoreByAdmin(req: Request) {

        // const { adminId, role } = req.body
        const user = req.user

        try {
            // check role
            const role = convertRoleToEnum(user?.role!)
            if (role === E_Role.CUSTOMER) throw new Error("Unauthorized role. Use Admin account")
            let storeResults = []
            if (role === E_Role.SUPER_ADMIN) {

                const stores = await findStoreBySuperAdmin()
                storeResults = [...stores]

            } else {
                // role store admin
                const stores = await findStoreByAdmin(user?.id!)
                storeResults = [...stores]
            }

            // feedback from service
            return returnServiceFeedback(200, storeResults, statusEnum.SUCCESS, "get store list by admin success")

        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get store list by admin failed")
        }


    }

}

export default new StoreServiceQuery()