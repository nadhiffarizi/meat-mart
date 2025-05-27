import { E_OrderStatus, E_TransactionStatus } from '.prisma/client';

export const convertOrderStatusToEnum = (status: string[]): E_OrderStatus[] => {
  if (!status || status.length === 0) {
    return [
      E_OrderStatus.AWAITING_PAYMENT,
      E_OrderStatus.CANCELED,
      E_OrderStatus.CONFIRMED,
      E_OrderStatus.ON_DELIVERY,
      E_OrderStatus.ON_PROCESS,
      E_OrderStatus.PENDING_ADMIN,
    ];
  } else {
    const statusEnums: E_OrderStatus[] = [];
    let inputStatus: string[] = [];
    if (status instanceof Array) {
      inputStatus = [...status];
    } else {
      inputStatus = [status];
    }
    for (let s of inputStatus) {
      switch (s) {
        case 'AWAITING_PAYMENT':
          statusEnums.push(E_OrderStatus.AWAITING_PAYMENT);
          break;
        case 'CANCELED':
          statusEnums.push(E_OrderStatus.CANCELED);
          break;
        case 'CONFIRMED':
          statusEnums.push(E_OrderStatus.CONFIRMED);
          break;
        case 'ON_DELIVERY':
          statusEnums.push(E_OrderStatus.ON_DELIVERY);
          break;
        case 'ON_PROCESS':
          statusEnums.push(E_OrderStatus.ON_PROCESS);
          break;
        case 'PENDING_ADMIN':
          statusEnums.push(E_OrderStatus.PENDING_ADMIN);
          break;
      }
    }

    return statusEnums;
  }
};

export const convertTransactionStatusToEnum = (
  status: string[],
): E_TransactionStatus[] => {
  if (!status || status.length === 0) {
    return [
      E_TransactionStatus.AWAITING_PAYMENT,
      E_TransactionStatus.CANCELED,
      E_TransactionStatus.DONE,
      E_TransactionStatus.CONFIRMED_ADMIN,
      E_TransactionStatus.PENDING_ADMIN,
    ];
  } else {
    const statusEnums: E_TransactionStatus[] = [];
    let inputStatus: string[] = [];
    if (status instanceof Array) {
      inputStatus = [...status];
    } else {
      inputStatus = [status];
    }

    for (let s of inputStatus) {
      switch (s) {
        case 'AWAITING_PAYMENT':
          statusEnums.push(E_TransactionStatus.AWAITING_PAYMENT);
          break;
        case 'CANCELED':
          statusEnums.push(E_TransactionStatus.CANCELED);
          break;
        case 'DONE':
          statusEnums.push(E_TransactionStatus.DONE);
          break;
        case 'CONFIRMED_ADMIN':
          statusEnums.push(E_TransactionStatus.CONFIRMED_ADMIN);
          break;
        case 'PENDING_ADMIN':
          statusEnums.push(E_TransactionStatus.PENDING_ADMIN);
          break;
      }
    }
    return statusEnums;
  }
};
