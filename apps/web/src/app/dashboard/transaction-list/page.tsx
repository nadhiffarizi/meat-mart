'use client';
import SearchBarTransactionList from '@/components/Transaction/SearchBarTransactionList.component';
import TransactionListCard from '@/components/Transaction/TransactionListCard.component';
import { setQueryParams } from '@/helper/filter/transactionFilter.helper';
import * as React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  getDataTransactionAPI,
  getPageTransactionAPI,
} from '@/helper/transaction/transaction.helper';
import { callToast } from '@/helper/notify.helper';
import {
  ITransaction,
  TrxChangeContext,
  TrxFilterContext,
} from '@/interface/transaction/transaction.interface';
import SearchBarTransactionListAdmin from '@/components/dashboard/transaction-list/SearchBarTransactionList.component';
import { useSession } from 'next-auth/react';
import TransactionListCardAdmin from '@/components/dashboard/transaction-list/TransactionListCard.component';
import TransactionAdminTable from '@/components/dashboard/transaction-list/TransactionListAdminTable.component';
import { IFilterTransactions } from '@/interface/dashboard/filter.interface';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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
  const [totalPage, setTotalPage] = React.useState();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isChange, setChange] = React.useState<boolean>();

  // when global filters change
  React.useEffect(() => {
    // set query params
    console.log(filterTransactions);
    console.log(setQueryParams(filterTransactions));
    const params = setQueryParams(filterTransactions, currentPage);
    router.replace(`${pathName}?${params.toString()}`);

    if (status === 'loading' || !session?.user.access_token) {
      setLoading(true);
      return;
    }

    const getTrxTotalPage = getPageTransactionAPI(
      `transaction/list/admin/totalpage?${params.toString()}`,
      session.user.access_token!,
    );

    getTrxTotalPage
      .then((v) => v.json())
      .then((value) => {
        console.log('trx total page with filter', value['data']['totalPage']);
        setTotalPage(value['data']['totalPage']);
      });

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
  }, [filterTransactions, isChange, status, currentPage]);

  return (
    <div className=" w-full flex flex-col gap-7 rounded-md overflow-auto px-2">
      <h1 className=" text-start text-3xl font-semibold text-primaryText">
        Admin Transaction List
      </h1>

      <div className="w-full ">
        <TrxFilterContext.Provider
          value={{ filterTransactions, setFilterTransactions }}
        >
          <SearchBarTransactionListAdmin />
        </TrxFilterContext.Provider>
      </div>
      <div className="w-full">
        {trxData && (
          <TrxChangeContext.Provider value={{ isChange, setChange }}>
            <TransactionAdminTable trxData={trxData} />
          </TrxChangeContext.Provider>
        )}
      </div>
      <Pagination>
        <PaginationContent className="!w-full !flex !justify-between !py-2">
          <PaginationItem className="!w-1/3">
            <PaginationPrevious
              onClick={() => {
                if (currentPage && currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              className="!ring-1 !ring-slate-300"
            />
          </PaginationItem>
          <PaginationItem className="w-1/3  flex justify-center">
            Page {currentPage} of {totalPage}
          </PaginationItem>
          <PaginationItem className="!w-1/3 flex justify-end">
            <PaginationNext
              onClick={() => {
                if (currentPage && currentPage < totalPage!) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              className="!ring-1 !ring-slate-300"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
