'use client';
import OrderListCard from '@/components/Order/OrderListCard.component';
import SearchBarOrderList from '@/components/Order/SearchBarOrderList.component';
import { setQueryParams } from '@/helper/filter/orderFilter.helper';
import { callToast } from '@/helper/notify.helper';
import { getDataOrderAPI, syncOrderDataFromAPI } from '@/helper/order.helper';
import { IFilterOrder } from '@/interface/filter.interface';
import { IOrder } from '@/interface/order.interface';
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

  //local state
  const router = useRouter();
  const pathName = usePathname();
  const [isLoading, setLoading] = React.useState<Boolean>(false);
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
      setLoading(true);
      const getOrderResponse = getDataOrderAPI(
        `order/list?${params.toString()}`,
        filterOrder!,
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
  }, [filterOrder, isChange]);
  return (
    <React.Fragment>
      <div className="flex justify-center items-center w-full bg-[#F5F5F5]">
        <div
          id="orderlist-container"
          className="flex flex-col gap-4 w-full h-full "
        >
          {/** order item list */}
          <div className=" w-full flex flex-col gap-6  rounded-md overflow-auto">
            <h1 className=" text-start text-3xl font-semibold text-secondaryGreen">
              Admin Order List
            </h1>
            <orderFilterContext.Provider
              value={{ filterOrder, setFilterOrder }}
            >
              <SearchBarOrderList />
            </orderFilterContext.Provider>

            {orderData &&
              orderData?.map((order, index: number) => {
                return (
                  <orderChangeContext.Provider value={{ isChange, setChange }}>
                    <OrderListCard orderData={order} key={index} />
                  </orderChangeContext.Provider>
                );
              })}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
