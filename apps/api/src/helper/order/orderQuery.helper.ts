import prisma from '@/prisma';
import {
  convertOrderStatusToEnum,
  convertTransactionStatusToEnum,
} from '../convertStatus.helper';
import { getTransactionByInvoice } from '../transaction/transactionQuery.helper';
import { E_OrderStatus, E_Role } from '.prisma/client';
import {
  findProductById,
  findThumbnailByProductId,
} from '../product/product.helper';
import { IUser } from '@/interface/User.interface';
import { convertRoleToEnum } from '../role.helper';
import { findStoreByAdmin, findStoreBySuperAdmin } from '../store/store.helper';
import { getTrxById } from '../transaction/transaction.helper';
import { string } from 'zod';

export const getOrderByInvoice = async (user: IUser, invoice: string) => {
  /** returns order list created by userId for specific invoice number */

  // get transaction by invoice number
  const trx = await getTransactionByInvoice(user, invoice);
  console.log(trx);

  if (!trx) return [];

  // get orderList by trxId

  const orderList = await prisma.transactionDetails.findMany({
    where: {
      transaction_id: trx.id,
    },
  });

  // for every order get product data
  const updatedList = [];
  for (let order of orderList) {
    //get product data
    const productData = await findProductById(order.product_id);
    // get product thumbnail
    const thumbnail = await findThumbnailByProductId(productData?.id!);

    const temp = {
      ...order,
      ...{ product: { image: thumbnail?.link, ...productData } },
    };
    updatedList.push(temp);
  }

  return updatedList;
};

export const getOrderByParams = async (
  userId: string,
  status?: string[],
  from?: string,
  until?: string,
  page?: string,
) => {
  // access by user facing service
  const trx = await prisma.transactions.findMany({
    select: {
      id: true,
    },
    where: {
      AND: {
        users_id: userId,
        deleted_at: null,
      },
    },
  });

  // get orderslist
  const orderList = await prisma.transactionDetails.findMany({
    select: {
      id: true,
      created_at: true,
      deleted_at: true,
      discount_code: true,
      discounted: true,
      price_per_product: true,
      product_id: true,
      sub_total: true,
      status: true,
      quantity: true,
      shipping_cost: true,
    },
    where: {
      AND: {
        transaction_id: {
          in: trx.map((t) => t.id),
        },
        created_at: {
          gte: !from ? new Date('January 01, 1979') : new Date(parseInt(from)),
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24), //plus 1 day
        },
        status: {
          in: convertOrderStatusToEnum(status as string[]),
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    skip: !page ? 0 : (Number(page) - 1) * 6,
    take: 6,
  });

  // for every order get product data
  const updatedList = [];
  for (let order of orderList) {
    //get product data
    const productData = await findProductById(order.product_id);
    // get product thumbnail
    const thumbnail = await findThumbnailByProductId(productData?.id!);

    const temp = {
      ...order,
      ...{ product: { image: thumbnail?.link, ...productData } },
    };
    updatedList.push(temp);
  }

  return updatedList;
};

export const getOrderbyStoresId = async (
  storesId: string[],
  status?: string[],
  from?: string,
  until?: string,
) => {
  // access by admin facing service

  const orderListByStoreId = await prisma.transactionDetails.findMany({
    where: {
      AND: {
        created_at: {
          gte: !from ? new Date('January 01, 1979') : from,
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24),
        },
        status: {
          in: convertOrderStatusToEnum(status as string[]),
        },
        store_id: {
          in: storesId,
        },
      },
    },
  });

  return orderListByStoreId;
};

export const getOrderByTrxId = async (trxId: string) => {
  /**returns order records by trxId */
  const orders = await prisma.transactionDetails.findMany({
    where: {
      transaction_id: trxId,
    },
  });
  return orders;
};

export const getOrderById = async (orderId: string) => {
  if (!orderId) return null;
  /**returns order by orderId */
  const order = await prisma.transactionDetails.findUnique({
    select: {
      status: true,
    },
    where: {
      id: orderId,
    },
  });

  return order;
};

export const getOrderAdminByInvoice = async (
  admin: IUser | undefined,
  invoice: string,
) => {
  /**returns order list by invoice number */
  if (!admin) throw new Error('no admin user found ');

  // populate admin ids
  let adminIds: any[] = [];
  const role = convertRoleToEnum(admin.role);
  if (role === E_Role.ADMIN) {
    adminIds = [admin.id];
  } else {
    // super user
    const admins = await prisma.users.findMany({
      where: {
        role: {
          in: [E_Role.ADMIN, E_Role.SUPER_ADMIN],
        },
      },
    });
    admins.forEach((a) => adminIds.push(a.id));
  }

  // get orders data
  const orders = await prisma.transactionDetails.findMany({
    where: {
      stores: {
        storeadmin_id: {
          in: adminIds,
        },
      },
      transactions: {
        invoice_number: String(invoice),
      },
    },
  });

  // add invoice number and product name in order list data
  const orderList: any[] = [];
  for (let o of orders) {
    const productName = (await findProductById(o.product_id))?.name;
    const temp = {
      ...o,
      ...{ invoice_number: invoice },
      ...{ product_name: productName },
    };
    orderList.push(temp);
  }

  return orderList;
};

export const getOrderAdminByParams = async (
  admin: IUser | undefined,
  status?: string[],
  from?: string,
  until?: string,
  storesId?: string[],
  page?: string,
) => {
  /**return order list by admin maximum 10 */
  if (!admin) throw new Error('no admin user found ');
  // populate stores id and admin Ids
  let stores: any = [];
  let adminIds = [];
  if (admin.role === E_Role.ADMIN) {
    stores = [...(await findStoreByAdmin(admin.id))];
    adminIds = [admin.role];
  } else {
    stores = [...(await findStoreBySuperAdmin())];
    const users = await prisma.users.findMany({
      where: {
        role: {
          in: [E_Role.SUPER_ADMIN, E_Role.ADMIN],
        },
      },
    });

    adminIds = [...users.map((user) => user.id)];
  }

  // get orders data
  const orders = await prisma.transactionDetails.findMany({
    where: {
      AND: {
        deleted_at: null,
        created_at: {
          gte: !from ? new Date('January 01, 1979') : new Date(parseInt(from)),
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24), //plus 1 day
        },
        status: {
          in: [...convertOrderStatusToEnum(status as string[])],
        },
        stores: {
          id: {
            in:
              !storesId || (storesId as string[]).length === 0
                ? stores.map((store: any) => store.id)
                : [...storesId].map((id) => id),
          },
          storeadmin_id: {
            in: adminIds,
          },
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    skip: !page ? 0 : (Number(page) - 1) * 10,
    take: 10,
  });

  // add product name and invoice number
  const orderList: any[] = [];
  for (let o of orders) {
    const productName = (await findProductById(o.product_id))?.name;
    const invoice = (await getTrxById(o.transaction_id))?.invoice_number;
    const temp = {
      ...o,
      ...{ invoice_number: invoice },
      ...{ product_name: productName },
    };
    orderList.push(temp);
  }
  return orderList;
};

export const getOrderByParamsTotalPage = async (
  userId: string,
  status?: string[],
  from?: string,
  until?: string,
) => {
  /**return total page based on filter, every page get 6 order list (customer facing) */
  // access by user facing service
  const trx = await prisma.transactions.findMany({
    select: {
      id: true,
    },
    where: {
      AND: {
        users_id: userId,
        deleted_at: null,
      },
    },
  });

  // get orderslist
  const count = await prisma.transactionDetails.count({
    where: {
      AND: {
        transaction_id: {
          in: trx.map((t) => t.id),
        },
        created_at: {
          gte: !from ? new Date('January 01, 1979') : new Date(parseInt(from)),
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24), //plus 1 day
        },
        status: {
          in: convertOrderStatusToEnum(status as string[]),
        },
      },
    },
  });

  if (count % 6 === 0) {
    return count / 6;
  } else {
    return Math.floor(count / 6) + 1;
  }
};

export const getOrderAdminByParamsTotalPage = async (
  admin: IUser | undefined,
  status?: string[],
  from?: string,
  until?: string,
  storesId?: string[],
) => {
  if (!admin) throw new Error('no admin user found ');
  // populate stores id and admin Ids
  let stores: any = [];
  let adminIds = [];
  if (admin.role === E_Role.ADMIN) {
    stores = [...(await findStoreByAdmin(admin.id))];
    adminIds = [admin.role];
  } else {
    stores = [...(await findStoreBySuperAdmin())];
    const users = await prisma.users.findMany({
      where: {
        role: {
          in: [E_Role.SUPER_ADMIN, E_Role.ADMIN],
        },
      },
    });

    adminIds = [...users.map((user) => user.id)];
  }

  // get orders data
  const count = await prisma.transactionDetails.count({
    where: {
      AND: {
        deleted_at: null,
        created_at: {
          gte: !from ? new Date('January 01, 1979') : new Date(parseInt(from)),
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24), //plus 1 day
        },
        status: {
          in: [...convertOrderStatusToEnum(status as string[])],
        },
        stores: {
          id: {
            in:
              !storesId || (storesId as string[]).length === 0
                ? stores.map((store: any) => store.id)
                : [...storesId].map((id) => id),
          },
          storeadmin_id: {
            in: adminIds,
          },
        },
      },
    },
  });

  if (count % 10 === 0) {
    return count / 10;
  } else {
    return Math.floor(count / 10) + 1;
  }
};
