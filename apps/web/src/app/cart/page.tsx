'use client';
import MyCartList from '@/components/Cart/MyCartList.component';
import CheckoutProgress from '@/components/Checkout/CheckoutProgress.component';
import ChooseAddressCheckout from '@/components/Checkout/ChooseAddressCheckout.component';
import PaymentSummaryCart from '@/components/Checkout/PaymentSummaryCart.component';
import { updateCheckoutProgress } from '@/redux/slice/checkout.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Cancel, Delete } from '@mui/icons-material';
import { Box, Button, Checkbox, IconButton, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function CartPage() {
  const cartState = useAppSelector((state) => state.cartState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // handle delete all
  const handleDeleteAllCart = async () => {};

  React.useEffect(() => {
    dispatch(updateCheckoutProgress('CART'));
  }, []);

  if (cartState.length === 0) {
    return (
      <div className="flex justify-center items-center w-full bg-[#F5F5F5]">
        <div className="flex flex-col items-center justify-center gap-10 w-4/5 max-w-[2000px] min-w-[600px] h-screen py-5 px-5 ">
          <h1 className="text-2xl">Your cart is empty</h1>
          <Button
            onClick={() => router.push('./')}
            className="!w-[300px] !bg-secondaryGreen !h-[50px] !rounded-3xl !text-white hover:"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

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
              {/**cart item list */}
              <Box
                id="title-container"
                sx={{
                  width: '100%',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '5px',
                  backgroundColor: 'white',
                  paddingLeft: '30px',
                  paddingRight: '40px',
                }}
              >
                <h1 className=" text-start text-3xl font-semibold text-secondaryGreen">
                  My Cart ({cartState.length})
                </h1>
              </Box>
              <div className="h-[650px] ">
                <MyCartList />
              </div>
            </div>
            <div
              id="rightsidebar-container"
              className="w-1/3 h-full flex flex-col gap-5"
            >
              {/**right sidebar container */}
              <div className="w-full h-1/4 py-5 px-7 shadow-md rounded-lg bg-white ">
                <ChooseAddressCheckout />
              </div>
              <div className="w-full h-3/5 max-h-[400px] py-5 px-7 shadow-md rounded-lg bg-white ">
                <PaymentSummaryCart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
