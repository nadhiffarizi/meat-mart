import prisma from '@/prisma';
import { convertTransactionStatusToEnum } from '../convertStatus.helper';
import { E_Role } from '.prisma/client';
import { findStoreByAdmin, findStoreBySuperAdmin } from '../store/store.helper';
import { IUser } from '@/interface/User.interface';
import { convertRoleToEnum } from '../role.helper';

export const getTransactionByInvoice = async (user: IUser, invoice: string) => {
  /** returns transaction list created by userId for specific invoice number */
  let adminIds: any[] = [];
  const role = convertRoleToEnum(user.id);
  if (role === E_Role.ADMIN) {
    adminIds.push(user.id);
  } else {
    const users = await prisma.users.findMany({
      where: {
        role: {
          in: [E_Role.SUPER_ADMIN, E_Role.ADMIN],
        },
      },
    });

    adminIds = [...users.map((user) => user.id)];
  }
  // get transaction by invoice number
  const transactions = await prisma.transactions.findFirst({
    where: {
      AND: {
        users_id: user.id,
        invoice_number: invoice,
      },
    },
  });

  return transactions;
};

export const getTransactionAdminByInvoice = async (
  user: IUser,
  invoice: string,
) => {
  /** returns transaction list created by userId for specific invoice number */
  let adminIds: any[] = [];
  const role = convertRoleToEnum(user.id);
  if (role === E_Role.ADMIN) {
    adminIds.push(user.id);
  } else {
    const users = await prisma.users.findMany({
      where: {
        role: {
          in: [E_Role.SUPER_ADMIN, E_Role.ADMIN],
        },
      },
    });

    adminIds = [...users.map((user) => user.id)];
  }

  // get transaction by invoice number
  const transactions = await prisma.transactions.findMany({
    where: {
      AND: {
        TransactionDetails: {
          every: {
            stores: {
              storeadmin_id: {
                in: adminIds,
              },
            },
          },
        },
        invoice_number: invoice,
      },
    },
  });

  return transactions;
};

export const getTransactionsByParams = async (
  userId: string,
  status?: string[],
  from?: string,
  until?: string,
  page?: string,
) => {
  // get 6 per page
  const transactions = await prisma.transactions.findMany({
    where: {
      AND: {
        users_id: userId,
        deleted_at: null,
        created_at: {
          gte: !from ? new Date('January 01, 1979') : new Date(parseInt(from)),
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24), //plus 1 day
        },
        transaction_status: {
          in: [...convertTransactionStatusToEnum(status as string[])],
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    skip: !page ? 0 : (Number(page) - 1) * 6,
    take: 6,
  });
  return transactions;
};

export const getTransactionsAdminByParams = async (
  adminId: string,
  status?: string[],
  from?: string,
  until?: string,
  storesId?: string[],
  role?: E_Role,
  page?: string,
) => {
  // get max 10 trx data
  // get stores id and admin Ids
  let stores: any = [];
  let adminIds = [];
  if (role === E_Role.ADMIN) {
    stores = [...(await findStoreByAdmin(adminId))];
    adminIds = [adminId];
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

  const transactions = await prisma.transactions.findMany({
    where: {
      AND: {
        deleted_at: null,
        created_at: {
          gte: !from ? new Date('January 01, 1979') : new Date(parseInt(from)),
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24), //plus 1 day
        },
        transaction_status: {
          in: [...convertTransactionStatusToEnum(status as string[])],
        },
        TransactionDetails: {
          every: {
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
      },
    },
    orderBy: {
      created_at: 'desc',
    },
    skip: !page ? 0 : (Number(page) - 1) * 10,
    take: 10,
  });
  return transactions;
};

export const getTrxByParamsTotalPage = async (
  user: IUser,
  status?: string[],
  from?: string,
  until?: string,
) => {
  /**get 6 transactions per page */
  if (!user) throw new Error('No user found');
  const countTrx = await prisma.transactions.count({
    where: {
      AND: {
        users_id: user.id,
        deleted_at: null,
        created_at: {
          gte: !from ? new Date('January 01, 1979') : new Date(parseInt(from)),
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24), //plus 1 day
        },
        transaction_status: {
          in: [...convertTransactionStatusToEnum(status as string[])],
        },
      },
    },
  });

  if (countTrx % 6 === 0) {
    // return count page
    return countTrx / 6;
  } else {
    // return count page
    return Math.floor(countTrx / 6) + 1;
  }
};

export const getTrxAdminByParamsTotalPage = async (
  adminId: string,
  status?: string[],
  from?: string,
  until?: string,
  storesId?: string[],
  role?: E_Role,
) => {
  /**get 10 transactions per page */
  // get stores id and admin Ids
  let stores: any = [];
  let adminIds = [];
  if (role === E_Role.ADMIN) {
    stores = [...(await findStoreByAdmin(adminId))];
    adminIds = [adminId];
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

  const count = await prisma.transactions.count({
    where: {
      AND: {
        deleted_at: null,
        created_at: {
          gte: !from ? new Date('January 01, 1979') : new Date(parseInt(from)),
          lte: !until
            ? new Date()
            : new Date(parseInt(until) + 1000 * 60 * 60 * 24), //plus 1 day
        },
        transaction_status: {
          in: [...convertTransactionStatusToEnum(status as string[])],
        },
        TransactionDetails: {
          every: {
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
      },
    },
  });

  if (count % 10 === 0) {
    return count / 10;
  } else {
    return Math.floor(count / 10) + 1;
  }
};
