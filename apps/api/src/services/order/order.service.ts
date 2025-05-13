import { statusEnum } from '@/enums/statusEnum.enums';
import {
  cancelOrderById,
  confirmOrderById,
  updateOrderStatusById,
} from '@/helper/order/order.helper';
import { returnServiceFeedback } from '@/helper/responseHandler.helper';
import { convertRoleToEnum } from '@/helper/role.helper';
import { trxUpdateByOrderConfirm } from '@/helper/transaction/transaction.helper';
import { E_OrderStatus, E_Role } from '@prisma/client';
import { Request } from 'express';

class OrderService {
  async confirmOrderByCust(req: Request) {
    const { orderId } = req.body;
    const user = req.user;
    try {
      const role = convertRoleToEnum(user?.role!);
      if (role !== E_Role.CUSTOMER) throw new Error('Unauthorized role');

      const order = await confirmOrderById(orderId);

      // update trx
      const trxUpdated = await trxUpdateByOrderConfirm(order.transaction_id);
      // feedback from service
      return returnServiceFeedback(
        200,
        { order, trxUpdated },
        statusEnum.SUCCESS,
        'confirm order by customer success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        406,
        (error as Error).message,
        statusEnum.FAILED,
        'confirm order by customer failed',
      );
    }
  }
}

export default new OrderService();
