'use client';
import SearchBarTransactionList from '@/components/Transaction/SearchBarTransactionList.component';
import TransactionListCard from '@/components/Transaction/TransactionListCard.component';
import { setQueryParams } from '@/helper/filter/transactionFilter.helper';
import { IFilterTransactions } from '@/interface/filter.interface';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getDataTransactionAPI } from '@/helper/transaction.helper';
import { callToast } from '@/helper/notify.helper';
import { ITransaction } from '@/interface/transaction.interface';
import SearchBarTransactionListAdmin from '@/components/dashboard/transaction-list/SearchBarTransactionList.component';

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

    try {
      setLoading(true);
      const getTrxResponse = getDataTransactionAPI(
        `transaction/list?${params.toString()}`,
        filterTransactions!,
      );

      getTrxResponse
        .then((v) => {
          if (v.status !== 200) throw new Error();
          return v.json();
        })
        .then((value) => setTrxData(value['data']))
        .catch(() =>
          callToast('No data satisfy filter criteria', 'INFO', 2000),
        );
    } catch (error) {
      callToast((error as Error).message, 'ERROR', 2000);
    }
    setLoading(false);

    // call get transaction to get list of transactions
  }, [filterTransactions, isChange]);

  return (
    <React.Fragment>
      {/** order item list */}
      <div className=" w-full flex flex-col gap-10   rounded-md overflow-auto ">
        <h1 className=" text-start text-3xl font-semibold text-secondaryGreen">
          Admin Transaction List
        </h1>

        <div className="w-full">
          <trxFilterContext.Provider
            value={{ filterTransactions, setFilterTransactions }}
          >
            <SearchBarTransactionListAdmin />
          </trxFilterContext.Provider>
        </div>

        {trxData &&
          trxData.map((trx, index: number) => {
            return (
              <trxChangeContext.Provider value={{ isChange, setChange }}>
                <TransactionListCard trx={trx} key={index} />
              </trxChangeContext.Provider>
            );
          })}
      </div>
    </React.Fragment>
  );
}
