'use client';
import SearchBarTransactionList from '@/components/Transaction/SearchBarTransactionList.component';
import TransactionListCard from '@/components/Transaction/TransactionListCard.component';
import { setQueryParams } from '@/helper/filter/transactionFilter.helper';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getDataTransactionAPI } from '@/helper/transaction/transaction.helper';
import { callToast } from '@/helper/notify.helper';
import { ITransaction } from '@/interface/transaction/transaction.interface';
import SearchBarTransactionListAdmin from '@/components/dashboard/transaction-list/SearchBarTransactionList.component';
import { useSession } from 'next-auth/react';
import TransactionListCardAdmin from '@/components/dashboard/transaction-list/TransactionListCard.component';
import TransactionAdminTable from '@/components/dashboard/transaction-list/TransactionListAdminTable.component';
import { IFilterTransactions } from '@/interface/dashboard/filter.interface';

// filter context type
export interface TransactionFilterContextType {
  filterTransactions: IFilterTransactions | undefined;
  setFilterTransactions: (filter: IFilterTransactions | undefined) => void;
}

export const trxFilterContext = React.createContext<
  TransactionFilterContextType | undefined
>(undefined);

// transaction status change
export interface ITrxChangeContextType {
  isChange: boolean | undefined;
  setChange: (isChange: boolean | undefined) => void;
}

export const trxChangeContext = React.createContext<
  ITrxChangeContextType | undefined
>(undefined);

export default function TransactionListPageAdmin() {
  //global state
  const [filterTransactions, setFilterTransactions] = React.useState<
    IFilterTransactions | undefined
  >(undefined);
  const { data: session, status } = useSession();

  //local state
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setLoading] = React.useState<Boolean>(false);
  const [trxData, setTrxData] = React.useState<ITransaction[]>();
  const [isChange, setChange] = React.useState<boolean>();

  // when global filters change
  React.useEffect(() => {
    // set query params
    console.log(filterTransactions);
    console.log(setQueryParams(filterTransactions));
    const params = setQueryParams(filterTransactions);
    router.replace(`${pathName}?${params.toString()}`);

    if (status === 'loading' || !session?.user.access_token) {
      setLoading(true);
      return;
    }

    setLoading(true);
    const getTrxResponse = getDataTransactionAPI(
      `transaction/list/admin?${params.toString()}`,
      filterTransactions!,
      session?.user.access_token!,
    );

    getTrxResponse
      .then((v) => {
        if (v.status !== 200) {
          callToast('No data satisfy filter criteria', 'INFO', 2000);
          throw new Error();
        }
        return v.json();
      })
      .then((value) => setTrxData(value['data']))
      .catch(() => callToast('No data satisfy filter criteria', 'INFO', 2000));
    setLoading(false);

    // call get transaction to get list of transactions
  }, [filterTransactions, isChange, status]);

  return (
    <div className=" w-full flex flex-col gap-7 rounded-md overflow-auto px-2">
      <h1 className=" text-start text-3xl font-semibold text-primaryText">
        Admin Transaction List
      </h1>

      <div className="w-full ">
        <trxFilterContext.Provider
          value={{ filterTransactions, setFilterTransactions }}
        >
          <SearchBarTransactionListAdmin />
        </trxFilterContext.Provider>
      </div>
      <div className="w-full">
        {trxData && (
          <trxChangeContext.Provider value={{ isChange, setChange }}>
            <TransactionAdminTable trxData={trxData} />
          </trxChangeContext.Provider>
        )}
      </div>
    </div>
  );
}
