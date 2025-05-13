'use client';
import CheckoutProgress from '@/components/Checkout/CheckoutProgress.component';
import PaymentSummaryCheckout from '@/components/Checkout/PaymentSummaryCheckout.component';
import ItemCard from '@/components/Payment/ItemCard.component';
import PaymentOptions from '@/components/Payment/PaymentOptions.component';
import { updateCheckoutProgress } from '@/redux/slice/checkout.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Box } from '@mui/material';
import { Key } from 'lucide-react';
import * as React from 'react';

export default function PaymentPage() {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state) => state.cartState);
  React.useEffect(() => {
    dispatch(updateCheckoutProgress('PAYMENT'));
  }, []);
  return (
    <React.Fragment>
      <div className="flex justify-center items-center w-full bg-[#F5F5F5]">
        <div className="flex flex-col gap-7 w-4/5 max-w-[2000px] min-w-[600px] py-5 px-5 ">
          <div
            id="checkout-progressCont"
            className="w-full flex items-center justify-center "
          >
            <div
              id="checkout-progressItem"
              className="flex max-w-[700px] min-w-[500px] h-[50px]"
            >
              <CheckoutProgress />
            </div>
          </div>
          <div id="main-container" className="flex w-full h-[670px] gap-5 ">
            <div
              id="mycart-container"
              className="flex flex-col gap-4 w-2/3 h-full "
            >
              {/** order item list */}
              <div className="h-[500px] w-full flex flex-col gap-3 bg-white rounded-md overflow-auto px-5 py-4">
                <h1 className=" text-start text-3xl font-semibold text-secondaryGreen">
                  Order Items ({cartState.length})
                </h1>
                {cartState.map((cartItem, index: number) => {
                  return <ItemCard cartItem={cartItem} key={index} />;
                })}
              </div>
            </div>
            <div
              id="rightsidebar-container"
              className="w-1/3 h-full flex flex-col gap-5"
            >
              {/**right sidebar container */}
              <div className="w-full h-1/2 max-h-[400px] py-5 px-7 shadow-md rounded-lg bg-white ">
                <PaymentSummaryCheckout />
              </div>
              <div className="w-full h-1/2 py-5 px-7 shadow-md rounded-lg bg-white ">
                <PaymentOptions />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
