import prisma from "@/prisma"
import { convertOrderStatusToEnum, convertTransactionStatusToEnum } from "../convertStatus.helper"

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

    if (!transactions) throw new Error("transaction id not found")
    return transactions
}

export const getTransactionsByParams = async (userId: string, status?: string[], from?: string, until?: string) => {
    // access by user facing service
    const transactions = await prisma.transactions.findMany({
        where: {
            AND: {
                users_id: userId,
                deleted_at: null,
                created_at: {
                    gte: !from ? new Date() : from,
                    lte: !until ? new Date() : until
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