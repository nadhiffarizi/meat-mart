'use client';

import { Box, Button, Typography } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center py-10">
      <div className="flex justify-center items-center w-4/5 h-[700px] bg-white rounded-lg shadow-md">
        <div className="flex flex-col justify-center items-center gap-14 px-5 py-5 ">
          <img
            className="h-auto w-full bg-secondaryGreen"
            src="../../../../logo-1.jpg"
          />
          <h1 className="text-5xl text-secondaryGreen font-semibold">
            Thank you for your order!
          </h1>
          <div
            id="payment-info-container"
            className="flex flex-col h-1/3 gap-5 items-center"
          >
            <Typography className="!whitespace-pre">
              Your payment has been received. Our team will process and ship
              your order
            </Typography>
          </div>

          <div className="w-full h-1/3 flex justify-between">
            <Button
              style={{ textTransform: 'none' }}
              onClick={() => router.push('/order-list')}
              className="!h-[50px] !w-[40%] !rounded-full !text-xl !text-secondaryGreen !bg-white ring-2 ring-secondaryGreen"
            >
              See my order
            </Button>
            <Button
              style={{ textTransform: 'none' }}
              onClick={() => router.push('/transaction-list')}
              className="!h-[50px] !w-[40%] !rounded-full !text-xl !text-white !bg-secondaryGreen"
            >
              Upload payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
