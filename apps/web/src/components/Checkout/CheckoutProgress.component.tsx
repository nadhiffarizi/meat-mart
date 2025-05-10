'use client';
import { useAppSelector } from '@/redux/store';
import {
  CheckCircle,
  Done,
  LocalActivityRounded,
  LocationCityRounded,
  LocationOn,
  Payment,
  ShoppingCart,
} from '@mui/icons-material';
import { Box, Divider, Icon, IconButton } from '@mui/material';
import * as React from 'react';

export default function CheckoutProgress() {
  const checkoutState = useAppSelector((state) => state.checkoutState);
  return (
    <div className="flex items-center justify-center py-[10px] ">
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          paddingRight: '10px',
        }}
      >
        <IconButton
          className={`${checkoutState.cart ? '!bg-secondaryGreen' : '!bg-slate-100'}  h-full w-[30px] !ring-2`}
        >
          <ShoppingCart
            sx={{ width: '120%' }}
            className={`${checkoutState.cart ? '!fill-white' : '!fill-slate-500'}`}
          />
        </IconButton>
        <div className="text-end text-sm">Cart</div>
        <div className="w-[50px] h-[.1rem]  bg-slate-300 rounded-xl" />
      </Box>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          paddingRight: '10px',
        }}
      >
        <IconButton
          className={`${checkoutState.payment ? '!bg-secondaryGreen' : '!bg-slate-100'}  h-full w-[30px] !ring-2`}
        >
          <Payment
            sx={{ width: '110%' }}
            className={`${checkoutState.payment ? '!fill-white' : '!fill-slate-500'}`}
          />
        </IconButton>
        <div className="text-end text-sm">Payment</div>
        <div className="w-[50px] h-[.1rem] bg-slate-300  rounded-xl"></div>
      </Box>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '10px',
          paddingRight: '10px',
        }}
      >
        <IconButton
          className={`${checkoutState.success ? '!bg-secondaryGreen' : '!bg-slate-100'}  h-full w-[30px] !ring-2`}
        >
          <Done
            sx={{ width: '130%' }}
            className={`${checkoutState.success ? '!fill-white' : '!fill-slate-500'}`}
          />
        </IconButton>
        <div className="text-end text-sm">Success</div>
      </Box>
    </div>
  );
}
