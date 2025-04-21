'use client';
import OrderListCard from '@/components/Order/OrderListCard.component';
import SearchBarOrderList from '@/components/Order/SearchBarOrderList.component';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import * as React from 'react';

export default function OrderListPage() {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cartState);
  React.useEffect(() => {}, []);
  return (
    <React.Fragment>
      <div className="flex justify-center items-center w-full bg-[#F5F5F5]">
        <div className="flex flex-col gap-7 w-4/5 max-w-[2000px] min-w-[600px] py-5 px-5 ">
          <div id="main-container" className="flex w-full h-[670px] gap-5 ">
            <div
              id="lefstsidebar-container"
              className="w-1/5 h-full flex flex-col gap-5"
            >
              {/**right sidebar container */}
              <div className="w-full h-full py-5 px-7  rounded-lg bg-white ">
                {/* <PaymentSummaryCheckout /> */}
              </div>
            </div>
            <div
              id="orderlist-container"
              className="flex flex-col gap-4 w-4/5 h-full "
            >
              {/** order item list */}
              <div className="h-[500px] w-full flex flex-col gap-6 bg-white rounded-md overflow-auto px-5 py-4">
                <h1 className=" text-start text-3xl font-semibold text-secondaryGreen">
                  Order List
                </h1>

                <SearchBarOrderList />
                <OrderListCard />
                {/* {cartState.map((cartItem, index: number) => {
                  return <ItemCard cartItem={cartItem} key={index} />;
                })} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
