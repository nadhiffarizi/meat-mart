import prisma from "@/prisma"
import { convertTransactionStatusToEnum } from "../convertStatus.helper"
import { E_Role } from "@prisma/client"
import { findStoreByAdmin, findStoreBySuperAdmin } from "../store/store.helper"

export const getTransactionByInvoice = async (userId: string, invoice: string) => {

    /** returns transaction list created by userId for specific invoice number */

    // get transaction by invoice number
    const transactions = await prisma.transactions.findFirst({
        where: {
            AND: {
                users_id: userId,
                invoice_number: invoice
            }
        }
    })

    return transactions
}

export const getTransactionAdminByInvoice = async (adminId: string, invoice: string) => {

    /** returns transaction list created by userId for specific invoice number */


    // get transaction by invoice number
    const transactions = await prisma.transactions.findMany({
        where: {
            AND: {
                TransactionDetails: {
                    every: {
                        stores: {
                            storeadmin_id: adminId
                        }
                    }
                },
                invoice_number: invoice
            }
        }
    })

    return transactions
}

export const getTransactionsByParams = async (userId: string, status?: string[], from?: string, until?: string) => {

    const transactions = await prisma.transactions.findMany({
        where: {
            AND: {
                users_id: userId,
                deleted_at: null,
                created_at: {
                    gte: !from ? new Date("January 01, 1979") : new Date(parseInt(from)),
                    lte: !until ? new Date() : new Date(parseInt(until) + 1000 * 60 * 60 * 24) //plus 1 day
                },
                transaction_status: {
                    in: [...convertTransactionStatusToEnum(status as string[])]
                }

            }
        }, orderBy: {
            created_at: 'desc'
        }
    })
    return transactions
}


export const getTransactionsAdminByParams = async (adminId: string, status?: string[], from?: string, until?: string, storesId?: string[], role?: E_Role) => {

    // get stores id and admin Ids
    let stores: any = []
    let adminIds = []
    if (role === E_Role.ADMIN) {
        stores = [...await findStoreByAdmin(adminId)]
        adminIds = [adminId]
    } else {
        stores = [...await findStoreBySuperAdmin()]
        const users = await prisma.users.findMany({
            where: {
                role: {
                    in: [E_Role.SUPER_ADMIN, E_Role.ADMIN]
                }
            }
        })

        adminIds = [...users.map((user) => user.id)]
    }


    const transactions = await prisma.transactions.findMany({
        where: {
            AND: {
                deleted_at: null,
                created_at: {
                    gte: !from ? new Date("January 01, 1979") : new Date(parseInt(from)),
                    lte: !until ? new Date() : new Date(parseInt(until) + 1000 * 60 * 60 * 24) //plus 1 day
                },
                transaction_status: {
                    in: [...convertTransactionStatusToEnum(status as string[])]
                },
                TransactionDetails: {
                    every: {
                        stores: {
                            id: {
                                in: !storesId || (storesId as string[]).length === 0 ? stores.map((store: any) => store.id) : [...storesId].map((id) => id)
                            },
                            storeadmin_id: {
                                in: adminIds
                            }
                        }
                    }
                }

            }
        }, orderBy: {
            created_at: 'desc'
        }
    })
    return transactions
}