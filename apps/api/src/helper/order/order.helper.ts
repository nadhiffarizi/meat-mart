import { ICart } from "@/interface/cart.interface"
import ILocation from "@/interface/location.interface"
import { chooseStock, findStockById, findStocksByProduct } from "../stock/stock.helper"
import { IEligibleToOrder } from "@/interface/order.interface"
import prisma from "@/prisma"
import { convertOrderStatusToEnum } from "../orderstatus.helper"
import { E_OrderStatus } from "@prisma/client"

export const updateCartToOrder = async (carts: ICart[], userId: string, loc1: ILocation) => {

    // filter eligible and not eligible
    const eligibleCarts: IEligibleToOrder = {
        eligibleCart: [],
        notEligibleCart: []
    }

    for (let cartItem of carts) {

        let currentStock = await findStockById(cartItem.stock_id)

        // last check if qttty in cart item more than  current stock
        if (cartItem.quantity > currentStock?.quantity!) {
            const availableStocks = await findStocksByProduct(currentStock?.product_id!, loc1)
            const chosenStockId = chooseStock(availableStocks, cartItem.quantity, cartItem, 'UPDATE')
            if (chosenStockId === currentStock?.id!) {
                eligibleCarts.notEligibleCart.push(cartItem)
            } else {
                currentStock = await findStockById(chosenStockId!)
                if (cartItem.quantity <= currentStock?.quantity!) {
                    // update cart
                    await prisma.carts.update({
                        where: {
                            id: cartItem.id,
                        }, data: {
                            stock_id: chosenStockId!
                        }
                    })
                    eligibleCarts.eligibleCart.push(cartItem)
                } else {
                    eligibleCarts.notEligibleCart.push(cartItem)
                }
            }
        }

        eligibleCarts.eligibleCart.push(cartItem)
    }

    return eligibleCarts
}

export const getShippingCost = (loc1: ILocation, loc2: ILocation) => {
    return 10000
}

export const getOrderByInvoice = async (userId: string, invoice: string) => {

    /** returns order list created by userId for specific invoice number */

    // get transaction by invoice number
    const trx = await prisma.transactions.findFirst({
        select: {
            id: true
        },
        where: {
            AND: {
                users_id: userId,
                invoice_number: invoice
            }
        }
    })

    if (!trx) throw new Error("trx Id not found")

    // get orderList by trxId

    const orderList = await prisma.transactionDetails.findMany({
        where: {
            transaction_id: trx.id!
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
        where: {
            AND: {
                transaction_id: {
                    in: trx.map((t) => t.id)
                }, created_at: {
                    gte: !from ? new Date() : from,
                    lte: !until ? new Date() : until
                }, status: {
                    in: convertOrderStatusToEnum(status as string[])
                },
            }

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

export const cancelOrderById = async (trxDetailid: string) => {
    // soft delete
    const trxDetailCanceled = await prisma.transactionDetails.update({
        where: {
            id: trxDetailid
        }, data: {
            deleted_at: new Date(),
            updated_at: new Date()
        }
    })

    // update stock
    const qttyOrder = await prisma.stocks.findUnique({
        select: {
            quantity: true
        },
        where: {
            id: trxDetailCanceled.stock_id
        }
    })
    const trx = await prisma.stocks.update({
        where: {
            id: trxDetailCanceled.stock_id
        }, data: {
            quantity: qttyOrder?.quantity! + trxDetailCanceled.quantity,
            updated_at: new Date()
        }
    })

    // update stock history

    return { trxDetailCanceled, trx }

}

export const confirmOrderById = async (trxDetailid: string) => {
    const order = await prisma.transactionDetails.update({
        where: {
            id: trxDetailid
        }, data: {
            status: E_OrderStatus.CONFIRMED
        }
    })

    return order
}

export const updateOrderDetails = async (trxId: string, statusToBe: E_OrderStatus) => {
    /**returns updated order details */


    const updatedTrxIds = await prisma.transactionDetails.updateMany({
        where: {
            transaction_id: trxId
        }, data: {
            status: statusToBe
        }
    })

    return updatedTrxIds
}
