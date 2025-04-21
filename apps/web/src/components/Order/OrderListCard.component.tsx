import { currencyFormatter } from '@/helper/product.helper';
import { ICart } from '@/interface/cart.interface';
import { ShoppingBag } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import * as React from 'react';

export default function OrderListCard() {
  const statusFormatter = (status: string) => {
    return (
      <Typography variant="overline">
        <span className="bg-slate-100 py-2 px-2 rounded-md text-xs font-semibold text-secondaryGreen">
          {' '}
          {status}
        </span>
      </Typography>
    );
  };
  return (
    <div
      className="w-full max-w-[2000px] h-[230px] flex flex-col py-3 px-5 gap-2 border-b-2
     bg-white ring-2 ring-slate-100 rounded-md"
    >
      <Box sx={{ width: '100%', height: '20%' }}>
        <div className="w-full h-full flex items-center gap-5 ">
          <ShoppingBag className="!fill-transparent !stroke-black !h-full" />
          <p>Purchase</p>
          <p className="text-secondaryGreen">Mon, 9 April 2025</p>
          <>{statusFormatter('tes')}</>
          <p>Invoice number</p>
        </div>
      </Box>
      <Box sx={{ width: '100%', height: '60%' }}>
        <div className="w-full h-full  flex justify-between gap-3">
          <div className="w-1/4 max-w-[100px] h-full max-h-[300px] bg-white">
            {/**image div */}
            product photo
          </div>
          <div className="w-full h-full max-h-[300px] flex flex-col py-3 px-3 bg-white ">
            <p>title</p>
            <p>Quantity</p>
          </div>
          <Divider orientation="vertical" sx={{ bgcolor: 'green' }} flexItem />
          <div className="w-1/2 max-w-[200px] h-full max-h-[300px] flex flex-col justify-center py-3 px-3 bg-white ">
            <p className="font-semibold">Total Belanja</p>
            <p>Rp. 10,000,000</p>
          </div>
        </div>
      </Box>
      <Box sx={{ width: '100%', height: '20%' }}>
        <div className="w-full h-full py-1 flex justify-end gap-7">
          <Button
            style={{ textTransform: 'none' }}
            className=" !w-[200px]  !text-secondaryGreen !font-semibold"
          >
            Check Order Detail
          </Button>
          <Button
            style={{ textTransform: 'none' }}
            className="!rounded-md !ring-secondaryGreen !w-[200px] !ring-2 !text-secondaryGreen !font-semibold"
          >
            Change Status
          </Button>
          <Button
            style={{ textTransform: 'none' }}
            className="!rounded-md !bg-secondaryGreen !ring-secondaryGreen !ring-2 !w-[200px] !text-white !font-semibold"
          >
            Buy Again
          </Button>
        </div>
      </Box>
    </div>
  );
}
