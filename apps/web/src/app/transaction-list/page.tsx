'use client';
import SearchBarTransactionList from '@/components/Transaction/SearchBarTransactionList.component';
import TransactionListCard from '@/components/Transaction/TransactionListCard.component';
import { setQueryParams } from '@/helper/filter/transactionFilter.helper';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getDataTransactionAPI } from '@/helper/transaction/transaction.helper';
import { callToast } from '@/helper/notify.helper';
import { ITransaction } from '@/interface/transaction/transaction.interface';
import { useSession } from 'next-auth/react';
import { Backdrop, CircularProgress } from '@mui/material';
import { IFilterTransactions } from '@/interface/dashboard/filter.interface';
import { profileSideMenu } from '@/helper/user/user.helper';
import Link from 'next/link';

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

export default function TransactionListPage() {
  //global state
  const [filterTransactions, setFilterTransactions] = React.useState<
    IFilterTransactions | undefined
  >(undefined);
  const { data: session, status } = useSession();

  //local state
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [trxData, setTrxData] = React.useState<ITransaction[]>();
  const [isChange, setChange] = React.useState<boolean>();
  const subCategories = profileSideMenu;

  // when global filters change
  React.useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }
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
        session?.user.access_token!,
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

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <React.Fragment>
      <div className="flex justify-center items-center w-full bg-[#F5F5F5]">
        <div className="flex flex-col gap-7 w-4/5 max-w-[2000px] min-w-[600px] py-5 px-5 ">
          <div id="main-container" className="flex w-full h-[670px] gap-5 ">
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow p-4 sticky top-4">
                <nav>
                  <ul className="space-y-2">
                    {subCategories.map((subcat) => (
                      <li key={subcat.id}>
                        <Link
                          href={`${subcat.slug}`}
                          className="block px-3 py-2 rounded hover:bg-gray-100 transition"
                        >
                          {subcat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
            <div
              id="orderlist-container"
              className="flex flex-col gap-4 w-4/5 h-full "
            >
              {/** order item list */}
              <div className=" w-full flex flex-col gap-10 bg-white rounded-md overflow-auto px-5 py-4">
                <h1 className=" text-start text-3xl font-semibold text-secondaryGreen">
                  Transaction List
                </h1>

                <div className="w-full">
                  <trxFilterContext.Provider
                    value={{ filterTransactions, setFilterTransactions }}
                  >
                    <SearchBarTransactionList />
                  </trxFilterContext.Provider>
                </div>

                {trxData &&
                  trxData.map((trx, index: number) => {
                    return (
                      <trxChangeContext.Provider
                        value={{ isChange, setChange }}
                        key={index}
                      >
                        <TransactionListCard trx={trx} key={index} />
                      </trxChangeContext.Provider>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
