import prisma from "@/prisma"
import { convertOrderStatusToEnum, convertTransactionStatusToEnum } from "../convertStatus.helper"
import { number } from "zod"
import { E_Role } from "@prisma/client"
import { findStoreByAdmin } from "../store/store.helper"
import { findStockById } from "../stock/stock.helper"

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

export const getTransactionByAdmin = async (adminId: string, role: E_Role) => {

    if (role !== E_Role.SUPER_ADMIN) {

        // find store
        const stores = await findStoreByAdmin(adminId)

        // find stocks 
        const stocks = await prisma.stocks.findMany({
            where: {
                store_id: {
                    in: stores.map((store) => store.id)
                }
            }
        })

        const transactions = await prisma.transactions.findMany({
            where: {
                TransactionDetails: {
                    every: {
                        stock_id: {
                            in: stocks.map((stock) => stock.id)
                        }
                    }
                }
            }
        })
        return transactions
    }

    const transactions = await prisma.transactions.findMany({})

    return transactions
}