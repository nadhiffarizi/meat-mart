import { ICart, ICartAfterDIsc } from "@/interface/cart.interface"
import ILocation from "@/interface/location.interface"
import { IOrderInput } from "@/interface/order.interface"
import prisma from "@/prisma"
import { E_OrderStatus, E_PromotionType, E_TransactionStatus } from "@prisma/client"
import { getShippingCost } from "../order/order.helper"
import { findStoreByStockId } from "../store/store.helper"
import { calculateAfterDisc, findDiscountByCode, findDiscountById } from "../discount/discount.helper"
import { findProductByStockId } from "../product/product.helper"
import { updateStockQuantity } from "../stock/stock.helper"
import { getOrderByTrxId } from "../order/orderQuery.helper"
import { midtransServerKey, xenditSecretKey } from "@/config"
// import * as midtransClient from 'midtrans-client'
import { Xendit } from 'xendit-node'
import { IDiscount } from "@/interface/discount.interface"


export const createDefaultTrxId = async (userId: string) => {
    const trxDefault = await prisma.transactions.create({
        data: {
            transaction_status: E_TransactionStatus.AWAITING_PAYMENT,
            payment_method: 'MANUAL',
            users_id: userId
        }
    })

    return trxDefault.id
}

export const createTrxDetails = async (trxId: string, cartItem: ICart, loc1: ILocation, orderInput?: IOrderInput) => {

    // get store location 
    const store = await findStoreByStockId(cartItem.stock_id)!
    const loc2: ILocation = {
        lat: store.latitude,
        lon: store.longitude
    }

    // shipping cost
    const shippingCost = getShippingCost(loc1, loc2)

    // get product
    const product = await findProductByStockId(cartItem.stock_id)
    // check if discount applied
    if (!orderInput?.discountId) {
        // add to transaction detail, cartItem which do not have discount

        const newTrxDetail = await prisma.transactionDetails.create({
            data: {
                discounted: false,
                created_at: new Date(),
                price_per_product: product.products?.price!,
                quantity: cartItem.quantity,
                shipping_cost: shippingCost,
                sub_total: cartItem.quantity * product.products?.price!,
                updated_at: new Date(),
                transaction_id: trxId,
                stock_id: cartItem.stock_id,
                users_id: cartItem.user_id,
                status: E_OrderStatus.AWAITING_PAYMENT,
                store_id: (await findStoreByStockId(cartItem.stock_id)).id,
                product_id: (await findProductByStockId(cartItem.stock_id)).products?.id!
            }
        })

        // update stock
        const updatedStock = await updateStockQuantity(cartItem.stock_id, cartItem.quantity, 'SUBTRACT')
        console.log(`updated stock from transaction: ${newTrxDetail.id}, resulting updatedStock: ${updatedStock}`);

        return newTrxDetail
    }
    else {
        // get price after discount
        const discount = (await findDiscountById(orderInput.discountId!))!

        const defaultPrice = product?.products?.price!

        const cartAfterDisc: ICartAfterDIsc = calculateAfterDisc(defaultPrice, discount.promotion_type, (discount as IDiscount)!, cartItem) as ICartAfterDIsc

        // add to transaction detail
        const newTrxDetail = await prisma.transactionDetails.create({
            data: {
                created_at: new Date(),
                discounted: true,
                discount_code: discount.discount_code,
                price_per_product: cartAfterDisc.pricePerProduct!,
                quantity: cartAfterDisc.cart.quantity,
                shipping_cost: shippingCost,
                sub_total: cartAfterDisc.subtotalPrice,
                updated_at: new Date(),
                transaction_id: trxId,
                stock_id: cartItem.stock_id,
                users_id: cartItem.user_id,
                status: E_OrderStatus.AWAITING_PAYMENT,
                store_id: (await findStoreByStockId(cartItem.stock_id)).id,
                product_id: (await findProductByStockId(cartItem.stock_id)).products?.id!
            }
        })
        // update stock
        const updatedStock = await updateStockQuantity(cartItem.stock_id, cartAfterDisc.cart.quantity, 'SUBTRACT')
        console.log(`updated stock from transaction: ${newTrxDetail.id}, resulting updatedStock: ${updatedStock}`);

        return newTrxDetail
    }
}

export const createTransaction = async (trxId: string, totalPrice: number, userId: string, method: string) => {
    const now = new Date()

    const updatedTransaction = await prisma.transactions.update({
        where: {
            id: trxId,
        }, data: {
            total_price: totalPrice,
            deadline_payment: setDeadlinePayment(new Date(now.getTime() + (1 * 60 * 60 * 1000))), // 1hr deadline
            invoice_number: generateInvoiceNumber(trxId, userId),
            payment_method: !method ? 'MANUAL' : method.toUpperCase()
        }
    })

    return updatedTransaction
}

const generateInvoiceNumber = (trxId: string, userId: string) => {
    const strTrxId = trxId.split("-")[0]
    const userIdStr = userId.split("-")[0].toUpperCase() || userId.toUpperCase()
    const dateStr = `${(new Date()).getFullYear()}${(new Date()).getMonth()}${(new Date()).getDate()}`
    const invoiceStr = `INV-${dateStr}-${userIdStr}-${strTrxId.toUpperCase()}`

    return invoiceStr
}

export const setDeadlinePayment = (now: Date) => {
    return new Date(now.getTime() + 1 * 60 * 60 * 1000) // added 2 hours
}

export const cancelTransaction = async (userId: string, trxId: string) => {
    /** returns trx which canceled */
    // update transaction
    const trx = await prisma.transactions.findUnique({
        where: {
            id: trxId
        }
    })

    if (!trx?.payment_proof && trx?.transaction_status === E_TransactionStatus.AWAITING_PAYMENT) {
        // update transaction table
        const updatedTrx = await prisma.transactions.update({
            where: {
                id: trx.id
            }, data: {
                transaction_status: E_TransactionStatus.CANCELED
            }
        })

        // update transaction details
        const trxDetails = await prisma.transactionDetails.updateMany({
            where: {
                transaction_id: trx.id
            }, data: {
                status: E_OrderStatus.CANCELED
            }
        })

        // search for transaction details/orders
        const orders = await getOrderByTrxId(trxId)
        if (orders.length === 0) throw new Error("orders with specified trx Id not found")
        for (let order of orders) {
            // return quantity for stock
            const updatedStock = await updateStockQuantity(order.stock_id, order.quantity, 'ADD')
        }


        return { updatedTrx, trxDetails }
    } else {
        return {}
    }
}

export const trxUpdateByOrderConfirm = async (trxId: string) => {
    // change to done if all order detail status set to confirm

    // find orders data
    const orders = await getOrderByTrxId(trxId)

    // populate status
    const orderStatus: E_OrderStatus[] = orders.map((order) => order.status)
    console.log(orderStatus);

    if (orderStatus.every((status) => status === E_OrderStatus.CONFIRMED)) {
        const trx = await prisma.transactions.update({
            where: {
                id: trxId,
                AND: {
                    id: trxId,
                    TransactionDetails: {
                        every: {
                            status: E_OrderStatus.CONFIRMED
                        }
                    }
                }
            }, data: {
                transaction_status: E_TransactionStatus.DONE
            }
        })
        return trx
    }

    return null
}

export const getTrxById = async (trxId: string) => {
    /**returns transaction, search based on id */

    const trx = await prisma.transactions.findUnique({
        where: {
            id: trxId
        }
    })

    return trx
}

export const updateTrxStatus = async (trxId: string, statusToBe: E_TransactionStatus) => {
    /**update status transaction based on input parameter */

    const updatedTrx = await prisma.transactions.update({
        where: {
            id: trxId
        }, data: {
            transaction_status: statusToBe
        }
    })

    return updatedTrx
}

// export const midTransSnap = () => {
//     let snap = new midtransClient.Snap({
//         isProduction: false,
//         serverKey: midtransServerKey
//     })

//     let parameter = {
//         "transaction_details": {
//             "order_id": "YOUR-ORDERID-123456",
//             "gross_amount": 10000
//         },
//         "credit_card": {
//             "secure": true
//         },
//         "customer_details": {
//             "first_name": "budi",
//             "last_name": "pratama",
//             "email": "budi.pra@example.com",
//             "phone": "08111222333"
//         }
//     };

//     snap.createTransaction(parameter)
//         .then((transaction: any) => {
//             // transaction token
//             let transactionToken = transaction.token;
//             console.log('transactionToken:', transactionToken);
//         })
// }

export const xenditSnap = () => {
    const xenditClient = new Xendit({
        secretKey: xenditSecretKey
    })
}