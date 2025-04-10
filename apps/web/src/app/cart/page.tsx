'use client';
import ProductCart from '@/components/Cart/ProductCart.Component';
import Navbar from '@/components/Navbar';
import { useAppSelector } from '@/redux/store';
import { Box, Checkbox, TextField } from '@mui/material';
import * as React from 'react';

export default function CartPage() {
  const cartState = useAppSelector((state) => state.cartState);
  return (
    <React.Fragment>
      <div className="flex justify-center items-center w-full bg-[#F5F5F5]">
        <div className="flex flex-col gap-5 w-4/5 max-w-[2000px] min-w-[600px] py-5 px-5 ">
          <div id="cart-title" className="w-full">
            <h1 className="text-start text-3xl font-semibold text-secondaryGreen">
              Your Cart
            </h1>
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
            {cartState.map((cartItem) => {
              return (
                <>
                  {' '}
                  <ProductCart cartItem={cartItem} />
                </>
              );
            })}
          </div>
          <div
            id="checkout-div"
            className="sticky bottom-5 w-full h-[200px] bg-white rounded-md shadow-xl ring-secondaryGreen ring-2"
          ></div>
        </div>
      </div>
    </React.Fragment>
  );
}
