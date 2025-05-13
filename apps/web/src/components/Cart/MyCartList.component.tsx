'use client';
import ProductCart from '@/components/Cart/ProductCart.Component';
import CheckoutProgress from '@/components/Checkout/CheckoutProgress.component';
import { ICart } from '@/interface/cart/cart.interface';
import { updateCheckoutProgress } from '@/redux/slice/checkout.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { ArrowBack, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { Box, Button, Checkbox, IconButton, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function MyCartList() {
  const cartState = useAppSelector((state) => state.cartState);
  const dispatch = useAppDispatch();
  const router = useRouter();

  React.useEffect(() => {
    dispatch(updateCheckoutProgress('CART'));
  }, []);

  return (
    <React.Fragment>
      <Box
        id="mycartList-container"
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          backgroundColor: '#F5F5F5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div className="flex flex-col w-full gap-5">
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
          id="footer-container"
          className="absolute bottom-0 h-[70px] w-full flex justify-between rounded-md shadow-sm px-4 bg-white"
        >
          <Button
            id="backtoshoping-button"
            style={{ textTransform: 'none' }}
            onClick={() => router.push('./')}
            startIcon={<ArrowBack />}
            className="!text-small !text-secondaryGreen !font-semibold hover:bg-transparent"
          >
            Continue Shopping
          </Button>
          <div className="flex justify-between gap-7 items-center h-full">
            <IconButton id="backpage-button" className="h-[40px]">
              <NavigateBefore />
            </IconButton>
            <IconButton id="nextpage-button" className="h-[40px]">
              <NavigateNext />
            </IconButton>
          </div>
        </div>
      </Box>
    </React.Fragment>
  );
}
