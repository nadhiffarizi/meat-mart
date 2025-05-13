import { statusEnum } from '@/enums/statusEnum.enums';
import {
  updateOrderStatusById,
  updateOrderStatusByTrxId,
} from '@/helper/order/order.helper';
import {
  getOrderById,
  getOrderByTrxId,
} from '@/helper/order/orderQuery.helper';
import { returnServiceFeedback } from '@/helper/responseHandler.helper';
import { updateStockQuantity } from '@/helper/stock/stock.helper';
import { updateTrxStatus } from '@/helper/transaction/transaction.helper';
import { E_OrderStatus, E_Role } from '@prisma/client';
import { Request } from 'express';

class OrderServiceAdmin {
  async cancelOrderAdmin(req: Request) {
    const user = req.user;
    const { orderId } = req.body;

    try {
      if (user?.role === E_Role.CUSTOMER)
        throw new Error('Unauthorized access');
      const order = await getOrderById(orderId);
      if (
        order?.status === E_OrderStatus.ON_DELIVERY ||
        order?.status === E_OrderStatus.CONFIRMED ||
        !order
      )
        throw new Error('Unauthorized access. Order cannot be canceled');

      // update status order by admin
      const updatedOrder = await updateOrderStatusById(
        orderId,
        E_OrderStatus.CANCELED,
      );
      if (!updatedOrder) throw new Error('No order data satisfied with the id');

      // return stock
      const returnedStock = await updateStockQuantity(
        updatedOrder.stock_id,
        updatedOrder.quantity,
        'ADD',
      );

      // check order details status in a transaction
      const ordersInTrx = await getOrderByTrxId(updatedOrder.transaction_id);
      if (
        ordersInTrx.every((order) => order.status === E_OrderStatus.CANCELED)
      ) {
        // update transaction status
        await updateTrxStatus(updatedOrder.transaction_id, 'CANCELED');
      }

      // feedback from service
      return returnServiceFeedback(
        200,
        { updatedOrder, ordersInTrx },
        statusEnum.SUCCESS,
        'get order list success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get order list canceled',
      );
    }
  }

  async sendOrderByAdmin(req: Request) {
    const { orderId } = req.body;
    const user = req.user;
    try {
      if (user?.role === E_Role.CUSTOMER)
        throw new Error('Unauthorized access');
      const order = await getOrderById(orderId);
      console.log(order?.status);

      if (order?.status !== E_OrderStatus.ON_PROCESS || !order)
        throw new Error('Unauthorized access. Order cannot be sent');
      const updatedOrder = await updateOrderStatusById(
        orderId,
        E_OrderStatus.ON_DELIVERY,
      );

      // feedback from service
      return returnServiceFeedback(
        200,
        updatedOrder,
        statusEnum.SUCCESS,
        'send order by admin success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        406,
        (error as Error).message,
        statusEnum.FAILED,
        'send order by admin failed',
      );
    }
  }
}

export default new OrderServiceAdmin();
