import cron from 'node-cron';
import prisma from '@/prisma';
import { E_OrderStatus } from '.prisma/client';
import { trxUpdateByOrderConfirm } from '../transaction/transaction.helper';
export const orderConfirmation = () => {
  const task = cron.schedule('*/5 * * * * * ', async () => {
    console.log('checking order confirmation.. at', new Date());
    // after 7 days if not confirm after sending the order, then do automatic confirm
    // for the sake of demo, runs every 5 seconds
    // populate orders
    const now = new Date();

    const orders = await prisma.transactionDetails.findMany({
      select: {
        id: true,
        transaction_id: true,
      },
      where: {
        AND: {
          status: E_OrderStatus.ON_DELIVERY,
          updated_at: {
            gte: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7), // deadline updating 7 days
          },
        },
      },
    });
    // update transaction details
    await prisma.transactionDetails.updateMany({
      where: {
        id: {
          in: orders.map((order) => order.id),
        },
      },
      data: {
        status: E_OrderStatus.CONFIRMED,
      },
    });

    // update transaction
    for (let order of orders) {
      trxUpdateByOrderConfirm(order.transaction_id);
    }
  });

  return task;
};
