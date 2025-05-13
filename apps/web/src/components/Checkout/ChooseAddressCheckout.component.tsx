import { useAppSelector } from '@/redux/store';
import { Box, Button } from '@mui/material';
import * as React from 'react';

export default function ChooseAddressCheckout() {
  const addressState = useAppSelector((state) => state.addressState);
  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="h-1/3 w-full flex items-center">
        <h1 className="text-xl text-black font-semibold">Delivery Address</h1>
      </div>
      <div className="h-2/3 max-h-[60px] w-full grid grid-cols-2 gap-2 rounded-sm ring-2 ring-secondaryGreen py-3 px-3">
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {' '}
          <p>{addressState.address}</p>{' '}
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'end',
          }}
        >
          <Button
            style={{ textTransform: 'none' }}
            className="!text-xs !text-red-400 !bg-transparent !hover:bg-transparent !font-semibold"
          >
            <p>Change Address</p>
          </Button>
        </Box>
      </div>
    </div>
  );
}
