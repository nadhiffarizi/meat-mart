import { statusEnum } from '@/enums/statusEnum.enums';
import {
  getOrderAdminByInvoice,
  getOrderAdminByParams,
  getOrderAdminByParamsTotalPage,
  getOrderByInvoice,
  getOrderByParams,
  getOrderByParamsTotalPage,
  getOrderbyStoresId,
} from '@/helper/order/orderQuery.helper';
import { returnServiceFeedback } from '@/helper/responseHandler.helper';
import { convertRoleToEnum } from '@/helper/role.helper';
import { E_Role } from '.prisma/client';
import { Request } from 'express';

class OrderService {
  async getOrderListUser(req: Request) {
    const { status, invoice, from, until, page } = req.query; // from and until are start date and end date search range
    const user = req.user;

    try {
      // check role
      const role = convertRoleToEnum(user?.role!);
      if (role !== E_Role.CUSTOMER)
        throw new Error('Unauthorized role, cannot access this service');

      let orderList: any = [];

      if (invoice) {
        // get order list by invoice number
        const result = await getOrderByInvoice(user!, String(invoice));
        if (result) {
          orderList = [...result];
        }
      } else {
        // get order list by status or date
        orderList = [
          ...(await getOrderByParams(
            user?.id!,
            status as string[],
            from as string,
            until as string,
            page as string,
          )),
        ];
        // console.log(orderList);
      }

      // feedback from service
      return returnServiceFeedback(
        200,
        orderList,
        statusEnum.SUCCESS,
        'get order list success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get order list failed',
      );
    }
  }

  async getOrderListUserTotalPage(req: Request) {
    const { status, invoice, from, until } = req.query; // from and until are start date and end date search range
    const user = req.user;
    try {
      // check role
      const role = convertRoleToEnum(user?.role!);
      if (role !== E_Role.CUSTOMER)
        throw new Error('Unauthorized role, cannot access this service');
      const count = await getOrderByParamsTotalPage(
        user?.id!,
        status as string[],
        from as string,
        until as string,
      );
      return returnServiceFeedback(
        200,
        { totalPage: count },
        statusEnum.SUCCESS,
        'fetching total page success',
      );
    } catch (error) {
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'fetching total page error',
      );
    }
  }

  async getOrderListAdmin(req: Request) {
    const user = req.user;
    const { store, status, invoice, from, until, page } = req.query; // from and until are start date and end date search range

    try {
      const role = convertRoleToEnum(user?.role!);
      if (role === E_Role.CUSTOMER)
        throw new Error('Unauthorized role, cannot access this service');
      let orderList: any = [];
      if (invoice) {
        // get by invoice number

        const orderByInvoice = await getOrderAdminByInvoice(
          user,
          invoice as string,
        );
        // console.log(orderByInvoice);

        orderList = [...orderByInvoice];
      } else {
        // get order by params
        const orderByParams = await getOrderAdminByParams(
          user,
          status as string[],
          from as string,
          until as string,
          store as string[],
          page as string,
        );
        orderList = [...orderByParams];
      }

      // feedback from service
      return returnServiceFeedback(
        200,
        orderList,
        statusEnum.SUCCESS,
        'get order list by admin success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get order list by aadmin failed',
      );
    }
  }
  async getOrderListAdminTotalPage(req: Request) {
    const { status, invoice, from, until } = req.query; // from and until are start date and end date search range
    const user = req.user;
    try {
      // check role
      const role = convertRoleToEnum(user?.role!);
      if (role === E_Role.CUSTOMER)
        throw new Error('Unauthorized role, cannot access this service');
      const count = await getOrderAdminByParamsTotalPage(
        user,
        status as string[],
        from as string,
        until as string,
      );
      return returnServiceFeedback(
        200,
        { totalPage: count },
        statusEnum.SUCCESS,
        'fetching total page success',
      );
    } catch (error) {
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'fetching total page error',
      );
    }
  }
}

export default new OrderService();
