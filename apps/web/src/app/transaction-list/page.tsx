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
import { useSession } from 'next-auth/react';
import { Backdrop, Button, CircularProgress, IconButton } from '@mui/material';
import { IFilterTransactions } from '@/interface/dashboard/filter.interface';
import { profileSideMenu } from '@/helper/user/user.helper';
import Link from 'next/link';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import { PageContext } from '@/interface/pagination.interface';

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
  const [totalPage, setTotalPage] = React.useState();
  const [currentPage, setCurrentPage] = React.useState(1);
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
    const params = setQueryParams(filterTransactions, currentPage);
    router.replace(`${pathName}?${params.toString()}`);

    try {
      setLoading(true);
      const getTrxTotalPage = getPageTransactionAPI(
        `transaction/list/totalpage?${params.toString()}`,
        session?.user.access_token!,
      );

      getTrxTotalPage
        .then((v) => v.json())
        .then((value) => {
          console.log(
            'trx total page with filter:',
            value['data']['totalPage'],
          );
          setTotalPage(value['data']['totalPage']);
        });

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
  }, [filterTransactions, isChange, currentPage]);

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
          <div
            id="main-container"
            className="flex w-full max-h-[1000px] gap-5 "
          >
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
                  <TrxFilterContext.Provider
                    value={{ filterTransactions, setFilterTransactions }}
                  >
                    <SearchBarTransactionList />
                  </TrxFilterContext.Provider>
                </div>

                {trxData &&
                  trxData.map((trx, index: number) => {
                    return (
                      <TrxChangeContext.Provider
                        value={{ isChange, setChange }}
                        key={index}
                      >
                        <TransactionListCard trx={trx} key={index} />
                      </TrxChangeContext.Provider>
                    );
                  })}

                <div className="flex justify-between gap-7 items-center h-full">
                  <Button
                    onClick={() => {
                      if (currentPage && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                      }
                    }}
                    id="backpage-button"
                    className="h-[40px] !text-secondaryGreen"
                    style={{ textTransform: 'none' }}
                  >
                    <NavigateBefore />
                    Previous
                  </Button>
                  <div className="w-full flex justify-center text-secondaryGreen ">
                    Page {currentPage} of {totalPage}
                  </div>

                  <Button
                    onClick={() => {
                      if (currentPage && currentPage < totalPage!) {
                        setTimeout(() => {
                          setLoading(true);
                          setCurrentPage(currentPage! + 1);
                          setLoading(false);
                        }, 1000);
                      }
                    }}
                    id="nextpage-button"
                    className="h-[40px] !text-secondaryGreen"
                    style={{ textTransform: 'none' }}
                  >
                    Next
                    <NavigateNext />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
