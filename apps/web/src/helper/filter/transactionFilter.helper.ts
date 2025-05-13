import {
  IFilterStatus,
  IFilterTransactions,
} from '@/interface/dashboard/filter.interface';

export const statusFilterUpdate = (
  statusFilter: string,
  statusState: IFilterStatus,
) => {
  let temp = { ...statusState };
  switch (statusFilter) {
    case 'AWAITING_PAYMENT':
      temp.AWAITING_PAYMENT = !temp.AWAITING_PAYMENT;
      break;
    case 'CANCELED':
      temp.CANCELED = !temp.CANCELED;
      break;
    case 'CONFIRMED_ADMIN':
      temp.CONFIRMED_ADMIN = !temp.CONFIRMED_ADMIN;
      break;
    case 'DONE':
      temp.DONE = !temp.DONE;
      break;
    case 'PENDING_ADMIN':
      temp.PENDING_ADMIN = !temp.PENDING_ADMIN;
      break;
  }
  return temp;
};

export const statusFilterToArray = (statusState: IFilterStatus) => {
  if (!statusState) return undefined;

  const statusArray: string[] = [];
  Object.entries(statusState).map((value) => {
    if (value[1]) {
      statusArray.push(value[0]);
    }
  });

  return statusArray;
};

export const setQueryParams = (
  filterTransactions: IFilterTransactions | undefined,
) => {
  if (!filterTransactions) return '';

  const params = new URLSearchParams();
  let queryParams: string[] = [];
  if (filterTransactions.from) {
    params.append('from', filterTransactions.from.toString());
  }
  if (filterTransactions.until) {
    params.append('until', filterTransactions.until.toString());
  }
  if (
    filterTransactions.invoiceNumber &&
    filterTransactions.invoiceNumber?.length > 0
  ) {
    params.append('invoice', filterTransactions.invoiceNumber);
  }

  if (
    filterTransactions.statusArray &&
    filterTransactions.statusArray?.length > 0
  ) {
    for (let status of filterTransactions.statusArray) {
      params.append('status', status);
    }
  }
  return params;
};
