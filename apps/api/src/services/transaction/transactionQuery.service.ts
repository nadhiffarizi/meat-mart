import { statusEnum } from '@/enums/statusEnum.enums';
import { returnServiceFeedback } from '@/helper/responseHandler.helper';
import { convertRoleToEnum } from '@/helper/role.helper';
import {
  getTransactionAdminByInvoice,
  getTransactionByInvoice,
  getTransactionsAdminByParams,
  getTransactionsByParams,
  getTrxAdminByParamsTotalPage,
  getTrxByParamsTotalPage,
} from '@/helper/transaction/transactionQuery.helper';
import { E_Role } from '.prisma/client';
import { Request } from 'express';

class TransactionListService {
  async getTransactionListUser(req: Request) {
    try {
      const { status, invoice, from, until, page } = req.query; // from and until are start date and end date search range
      const user = req.user;

      // check role
      const role_ = convertRoleToEnum(user?.role!);

      if (role_ !== E_Role.CUSTOMER)
        throw new Error('role is customer, cannot access this service');

      let transactionList: any = [];

      if (invoice) {
        // get transaction list by invoice number
        const result = await getTransactionByInvoice(user!, String(invoice));
        if (result) {
          transactionList = [result];
        }
      } else {
        // get order list by status or date
        transactionList = [
          ...(await getTransactionsByParams(
            user?.id!,
            status as string[],
            from as string,
            until as string,
            page as string,
          )),
        ];
      }
      console.log(user?.id);

      // feedback from service
      return returnServiceFeedback(
        200,
        transactionList,
        statusEnum.SUCCESS,
        'get transaction list success',
      );
    } catch (error) {
      // feedback from service
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get transaction list failed',
      );
    }
  }

  async getTrxListUserCountPage(req: Request) {
    try {
      const { status, invoice, from, until, page } = req.query; // from and until are start date and end date search range
      const user = req.user;

      // check role
      const role_ = convertRoleToEnum(user?.role!);

      if (role_ !== E_Role.CUSTOMER)
        throw new Error('role is customer, cannot access this service');
      const count = await getTrxByParamsTotalPage(
        user!,
        status as string[],
        from as string,
        until as string,
      );
      return returnServiceFeedback(
        200,
        { totalPage: count },
        statusEnum.SUCCESS,
        'get total page success',
      );
    } catch (error) {
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get total page failed',
      );
    }
  }

  async getTransactionListAdmin(req: Request) {
    const user = req.user;
    const { store, status, invoice, from, until, page } = req.query; // from and until are start date and end date search range

    try {
      // check role
      const role = convertRoleToEnum(user?.role!);
      if (role === E_Role.CUSTOMER) throw new Error('Unauthorized role');
      let transactionList: any = [];
      if (invoice) {
        // get transaction list by invoice number
        const result = await getTransactionAdminByInvoice(
          user!,
          String(invoice),
        );
        transactionList = [...result];
      } else {
        // get order list by status or date
        transactionList = [
          ...(await getTransactionsAdminByParams(
            user?.id!,
            status as string[],
            from as string,
            until as string,
            store as string[],
            user?.role,
            page as string,
          )),
        ];
      }

      return returnServiceFeedback(
        200,
        transactionList,
        statusEnum.SUCCESS,
        'get transaction by admin success',
      );
    } catch (error) {
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get transaction by aadmin failed',
      );
    }
  }

  async getTrxListAdminCountPage(req: Request) {
    const user = req.user;
    const { store, status, invoice, from, until, page } = req.query; // from and until are start date and end date search range
    try {
      // check role
      const role = convertRoleToEnum(user?.role!);
      if (role === E_Role.CUSTOMER) throw new Error('Unauthorized role');
      const count = await getTrxAdminByParamsTotalPage(
        user?.id!,
        status as string[],
        from as string,
        until as string,
        store as string[],
        role,
      );

      return returnServiceFeedback(
        200,
        { totalPage: count },
        statusEnum.SUCCESS,
        'get total page success',
      );
    } catch (error) {
      return returnServiceFeedback(
        400,
        (error as Error).message,
        statusEnum.FAILED,
        'get total page failed',
      );
    }
  }
}

export default new TransactionListService();
