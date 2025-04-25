import { statusEnum } from "@/enums/statusEnum.enums"
import { returnServiceFeedback } from "@/helper/responseHandler.helper"
import { convertRoleToEnum } from "@/helper/role.helper"
import { getTransactionByInvoice, getTransactionsByParams } from "@/helper/transaction/transactionQuery.helper"
import { E_Role } from "@prisma/client"
import { Request } from "express"

class TransactionListService {
    async getTransactionListUser(req: Request) {
        try {
            const { status, invoice, from, until } = req.query // from and until are start date and end date search range
            const { userId, role } = req.body


            // check role
            const role_ = convertRoleToEnum(role)

            if (role_ !== E_Role.CUSTOMER) throw new Error("role is customer, cannot access this service")

            let transactionList: any = []

            if (invoice) {
                // get transaction list by invoice number
                const result = await getTransactionByInvoice(userId, String(invoice))
                if (result) {
                    transactionList = [result]
                }
            } else {
                // get order list by status or date 
                transactionList = [...(await getTransactionsByParams(userId, status as string[], from as string, until as string))]
            }

            // feedback from service
            return returnServiceFeedback(200, transactionList, statusEnum.SUCCESS, "get transaction list success")
        } catch (error) {
            // feedback from service
            return returnServiceFeedback(400, (error as Error).message, statusEnum.FAILED, "get transaction list failed")
        }


    }
}

export default new TransactionListService()