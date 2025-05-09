import { statusEnum } from '@/enums/statusEnum.enums';
import cron from 'node-cron'
import { returnServiceFeedback } from '../responseHandler.helper';
import prisma from '@/prisma';
import { E_OrderStatus, E_TransactionStatus } from '@prisma/client';
import { updateOrderStatusByTrxId } from '../order/order.helper';
import { updateStockQuantity } from '../stock/stock.helper';
export const deadlinePayment = () => {
    const task = cron.schedule("*/10 * * * * * ", async () => {
        console.log("checking deadline payment..");
        // deadline payment for 2 hrs, update where the deadline already exceeds
        // for the sake of demo, runs every 5 seconds
        // update transaction status
        const unpaidTrx = await prisma.transactions.findMany({
            select: {
                id: true,
                TransactionDetails: {
                    select: {
                        stock_id: true,
                        quantity: true
                    }
                }
            },
            where: {
                AND: {
                    payment_proof: null,
                    deadline_payment: {
                        lte: new Date()
                    }
                }
            }
        })
        await prisma.transactions.updateMany({
            where: {
                id: {
                    in: unpaidTrx.map((trx) => trx.id)
                }
            },
            data: {
                transaction_status: E_TransactionStatus.CANCELED
            }
        })

        // update transaction details
        for (let trx of unpaidTrx) {
            updateOrderStatusByTrxId(trx.id, E_OrderStatus.CANCELED)
            for (let order of trx.TransactionDetails) {
                updateStockQuantity(order.stock_id, order.quantity, 'ADD')
            }
        }

    }, {
        scheduled: false
    })

    return task
}