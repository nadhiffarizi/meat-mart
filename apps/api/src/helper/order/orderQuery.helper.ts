import prisma from "@/prisma"
import { convertOrderStatusToEnum } from "../convertStatus.helper"
import { getTransactionByInvoice } from "../transaction/transactionQuery.helper"
import { E_OrderStatus } from "@prisma/client"


export const getOrderByInvoice = async (userId: string, invoice: string) => {

    /** returns order list created by userId for specific invoice number */

    // get transaction by invoice number
    const trx = await getTransactionByInvoice(userId, invoice)

    if (!trx) return []

    // get orderList by trxId

    const orderList = await prisma.transactionDetails.findMany({
        where: {
            transaction_id: trx.id
        }
    })

    return orderList
}

export const getOrderByParams = async (userId: string, status?: string[], from?: string, until?: string) => {
    // access by user facing service
    const trx = await prisma.transactions.findMany({
        select: {
            id: true
        },
        where: {
            AND: {
                users_id: userId,
                deleted_at: null
            }
        }
    })

    // get orderslist
    const orderList = await prisma.transactionDetails.findMany({
        select: {
            id: true,
            created_at: true,
            deleted_at: true,
            discount_code: true,
            discounted: true,
            price_per_product: true,
            sub_total: true,
            products: {
                select: {
                    name: true
                }
            },
            status: true,
            quantity: true,
            shipping_cost: true
        },
        where: {
            AND: {
                transaction_id: {
                    in: trx.map((t) => t.id)
                }, created_at: {
                    gte: !from ? new Date("January 01, 1979") : new Date(parseInt(from)),
                    lte: !until ? new Date() : new Date(parseInt(until) + 1000 * 60 * 60 * 24) //plus 1 day
                }, status: {
                    in: convertOrderStatusToEnum(status as string[])
                },
            }

        },
        orderBy: {
            created_at: 'desc'
        }
    })

    return orderList
}

export const getOrderbyStoresId = async (storesId: string[], status?: string[], from?: string, until?: string) => {
    // access by admin facing service

    const orderListByStoreId = await prisma.transactionDetails.findMany({
        where: {
            AND: {
                created_at: {
                    gte: !from ? new Date() : from,
                    lte: !until ? new Date() : until
                }, status: {
                    in: convertOrderStatusToEnum(status as string[])
                }, store_id: {
                    in: storesId
                }
            }
        }
    })

    return orderListByStoreId
}

export const getOrderByTrxId = async (trxId: string) => {
    /**returns order records by trxId */
    const orders = await prisma.transactionDetails.findMany({
        where: {
            transaction_id: trxId
        }
    })
    return orders
}
