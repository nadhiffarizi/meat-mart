'use client';
import ProductCart from '@/components/Cart/ProductCart.Component';
import CheckoutProgress from '@/components/Checkout/CheckoutProgress.component';
import { ICart } from '@/interface/cart.interface';
import { updateCheckoutProgress } from '@/redux/slice/checkout.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Box, Button, Checkbox, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function CartPage() {
  const cartState = useAppSelector((state) => state.cartState);
  const checkoutState = useAppSelector((state) => state.checkoutState);
  const dispatch = useAppDispatch();

  const router = useRouter();
  // React.useEffect(() => {
  //   console.log(cartState);
  // });

  React.useEffect(() => {
    dispatch(updateCheckoutProgress('CART'));
  }, []);

  if (cartState.length === 0) {
    return (
      <div className="flex justify-center items-center w-full bg-[#F5F5F5]">
        <div className="flex flex-col items-center justify-center gap-10 w-4/5 max-w-[2000px] min-w-[600px] h-[400px] py-5 px-5 ">
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
            id="cart-title"
            className="w-full flex items-center justify-between "
          >
            <h1 className="w-1/2 text-start text-3xl font-semibold text-secondaryGreen">
              Your Cart
            </h1>
            <div className="flex w-1/2 h-[50px] justify-end">
              <CheckoutProgress />
            </div>
          </div>
          <div
            id="cart-table-header"
            className="w-full h-[70px] grid grid-cols-2 bg-white rounded-md shadow-sm "
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '.7em',
                gap: '10px',
              }}
            >
              <Checkbox color="success" />
              <p className="text-lg ">Product</p>
            </Box>
            <Box sx={{ width: '100%' }}>
              <div className="w-full h-full grid grid-cols-4">
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'grey',
                  }}
                >
                  Price
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'grey',
                  }}
                >
                  Quantity
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'grey',
                  }}
                >
                  Subtotal
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'grey',
                  }}
                >
                  Action
                </Box>
              </div>
            </Box>
          </div>
          <div id="cart-items" className="flex flex-col gap-7 w-full  ">
            {cartState.map((cartItem: ICart, index: number) => {
              return (
                <>
                  {' '}
                  <ProductCart cartItem={cartItem} key={index} />
                </>
              );
            })}
          </div>
          <div
            id="checkout-div"
            className="sticky bottom-0 w-full h-[150px] bg-white shadow-xl ring-secondaryGreen ring-2"
          ></div>
        </div>
      </div>
    </React.Fragment>
  );
}
