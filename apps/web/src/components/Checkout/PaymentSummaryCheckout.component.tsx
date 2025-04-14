import { countCartTotalPrice } from '@/helper/cart.helper';
import {
  totalAfterDiscount,
  totalDiscountApplied,
} from '@/helper/checkout.helper';
import { currencyFormatter } from '@/helper/product.helper';
import { useAppSelector } from '@/redux/store';
import { Box, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function PaymentSummaryCheckout() {
  const cartState = useAppSelector((state) => state.cartState);
  const router = useRouter();
  return (
    <div className="w-full h-full flex flex-col ">
      <div className="h-1/5 w-full flex items-center ">
        <h1 className="text-xl text-black font-semibold">Payment Summary</h1>
      </div>
      <div className="relative h-4/5 max-h-[280px] w-full flex flex-col gap-2 rounded-sm  py-2 ">
        <div className="w-full h-full flex flex-col gap-1 justify-evenly  ">
          <Box
            sx={{
              width: '100%',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              borderBottom: 'solid 2px rgba(220, 220, 220, 0.7)',
              paddingBottom: '5px',
            }}
          >
            {' '}
            <div className="w-full h-full grid grid-cols-2">
              <div className="col-span-1 ">
                <p>Total Price</p>{' '}
              </div>
              <div className="col-span-1 flex justify-end">
                <p>{currencyFormatter(countCartTotalPrice(cartState))}</p>{' '}
              </div>
            </div>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: 'solid 2px rgba(220, 220, 220, 0.7)',
              paddingBottom: '5px',
            }}
          >
            <div className="w-full h-full grid grid-cols-2">
              <div className="col-span-1 ">
                <p>
                  <p>Total Discount</p>{' '}
                </p>{' '}
              </div>
              <div className="col-span-1 flex justify-end">
                <p className="text-secondaryGreen">
                  -{' '}
                  {currencyFormatter(
                    totalDiscountApplied(cartState).totalDiscountAmount,
                  )}
                </p>{' '}
              </div>
            </div>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: 'solid 2px rgba(220, 220, 220, 0.7)',
              paddingBottom: '5px',
            }}
          >
            <div className="w-full h-full grid grid-cols-2">
              <div className="col-span-1 ">
                <p>You Saved</p>{' '}
              </div>
              <div className="col-span-1 flex justify-end">
                <p className="text-secondaryGreen">
                  {totalDiscountApplied(cartState).discountPercentage}%
                </p>{' '}
              </div>
            </div>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              borderBottom: 'solid 2px rgba(220, 220, 220, 0.7)',
              paddingBottom: '5px',
            }}
          >
            <div className="w-full h-full grid grid-cols-2">
              <div className="col-span-1 ">
                <p className="font-semibold">Total</p>{' '}
              </div>
              <div className="col-span-1 flex justify-end">
                <p className=" font-semibold">
                  {currencyFormatter(
                    parseFloat(totalAfterDiscount(cartState).toFixed(4)),
                  )}
                </p>{' '}
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}
