'use client';
import OrderAdminTable from '@/components/dashboard/order-list/OrderListAdminTable.component';
import SearchBarOrderListAdmin from '@/components/dashboard/order-list/SearchBarOrderList.component';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { setQueryParams } from '@/helper/filter/orderFilter.helper';
import { callToast } from '@/helper/notify.helper';
import {
  getDataOrderAPI,
  getPageOrderAPI,
  syncOrderDataFromAPI,
} from '@/helper/transaction/order.helper';
import { IFilterOrder } from '@/interface/dashboard/filter.interface';
import {
  IOrder,
  OrderChangeContext,
  OrderFilterContext,
} from '@/interface/transaction/order.interface';
import { Backdrop, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';
export default function OrderListPageAdmin() {
  //global state
  const [filterOrder, setFilterOrder] = React.useState<
    IFilterOrder | undefined
  >(undefined);
  const { data: session, status } = useSession();

  //local state
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [orderData, setOrderData] = React.useState<IOrder[]>();
  const [totalPage, setTotalPage] = React.useState();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isChange, setChange] = React.useState<boolean>();

  // when global filters change
  React.useEffect(() => {
    // set query params
    console.log(filterOrder);
    console.log(setQueryParams(filterOrder));
    const params = setQueryParams(filterOrder, currentPage);
    router.replace(`${pathName}?${params.toString()}`);

    try {
      if (status === 'loading' || !session?.user.access_token) {
        setLoading(true);
        return;
      }
      // get total page
      const getOrderTotalPage = getPageOrderAPI(
        `order/list/admin/totalpage?${params.toString()}`,
        session.user.access_token!,
      );

      getOrderTotalPage
        .then((v) => v.json())
        .then((value) => {
          console.log(
            'order total page with filter',
            value['data']['totalPage'],
          );
          setTotalPage(value['data']['totalPage']);
        });

      setLoading(true);
      const getOrderResponse = getDataOrderAPI(
        `order/list/admin?${params.toString()}`,
        filterOrder!,
        session?.user.access_token!,
      );

      getOrderResponse
        .then((v) => {
          if (v.status !== 200) throw new Error();
          return v.json();
        })
        .then((value) => {
          setOrderData(syncOrderDataFromAPI(value['data']));
        })
        .catch(() =>
          callToast('No data satisfy filter criteria', 'INFO', 2000),
        );
    } catch (error) {
      callToast((error as Error).message, 'ERROR', 2000);
    }
    setLoading(false);

    // call get transaction to get list of transactions
  }, [filterOrder, isChange, status, currentPage]);

  if (isLoading) {
    return (
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <React.Fragment>
      <div className="flex justify-center items-center w-full">
        <div
          id="orderlist-container"
          className="flex flex-col gap-4 w-full h-full px-2"
        >
          {/** order item list */}
          <div className=" w-full flex flex-col gap-6  rounded-md overflow-auto">
            <h1 className=" text-start text-3xl font-semibold text-primaryText">
              Admin Order List
            </h1>
            <div className="w-full px-1">
              <OrderFilterContext.Provider
                value={{ filterOrder, setFilterOrder }}
              >
                <SearchBarOrderListAdmin />
              </OrderFilterContext.Provider>
            </div>
            <div className="w-full px-1">
              {orderData && (
                <OrderChangeContext.Provider value={{ isChange, setChange }}>
                  <OrderAdminTable orderData={orderData} />
                </OrderChangeContext.Provider>
              )}
            </div>
            <Pagination>
              <PaginationContent className="!w-full !flex !justify-between !py-2 !px-2">
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
        </div>
      </div>
    </React.Fragment>
  );
}
