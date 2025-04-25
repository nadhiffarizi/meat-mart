import prisma from "@/prisma"
import { convertOrderStatusToEnum, convertTransactionStatusToEnum } from "../convertStatus.helper"
import { number } from "zod"

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