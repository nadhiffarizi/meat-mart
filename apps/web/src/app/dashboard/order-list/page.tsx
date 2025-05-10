'use client';
import OrderAdminTable from '@/components/dashboard/order-list/OrderListAdminTable.component';
import SearchBarOrderListAdmin from '@/components/dashboard/order-list/SearchBarOrderList.component';
import OrderListCard from '@/components/Order/OrderListCard.component';
import SearchBarOrderList from '@/components/Order/SearchBarOrderList.component';
import { setQueryParams } from '@/helper/filter/orderFilter.helper';
import { callToast } from '@/helper/notify.helper';
import {
  getDataOrderAPI,
  syncOrderDataFromAPI,
} from '@/helper/transaction/order.helper';
import { IFilterOrder } from '@/interface/filter.interface';
import { IOrder } from '@/interface/transaction/order.interface';
import { Backdrop, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

// filter context type
export interface OrderFilterContextType {
  filterOrder: IFilterOrder | undefined;
  setFilterOrder: (filter: IFilterOrder | undefined) => void;
}

export const orderFilterContext = React.createContext<
  OrderFilterContextType | undefined
>(undefined);

// order status change context type
export interface IOrderChangeContextType {
  isChange: boolean | undefined;
  setChange: (isChange: boolean | undefined) => void;
}
export const orderChangeContext = React.createContext<
  IOrderChangeContextType | undefined
>(undefined);

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
  const [isChange, setChange] = React.useState<boolean>();

  // when global filters change
  React.useEffect(() => {
    // set query params
    console.log(filterOrder);
    console.log(setQueryParams(filterOrder));
    const params = setQueryParams(filterOrder);
    router.replace(`${pathName}?${params.toString()}`);

    try {
      if (status === 'loading' || !session?.user.access_token) {
        setLoading(true);
        return;
      }

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
  }, [filterOrder, isChange, status]);

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
        <div
          id="orderlist-container"
          className="flex flex-col gap-4 w-full h-full px-2"
        >
          {/** order item list */}
          <div className=" w-full flex flex-col gap-6  rounded-md overflow-auto">
            <h1 className=" text-start text-3xl font-semibold text-primaryText">
              Admin Order List
            </h1>
            <orderFilterContext.Provider
              value={{ filterOrder, setFilterOrder }}
            >
              <SearchBarOrderListAdmin />
            </orderFilterContext.Provider>

            {orderData && (
              <orderChangeContext.Provider value={{ isChange, setChange }}>
                <OrderAdminTable orderData={orderData} />
              </orderChangeContext.Provider>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
