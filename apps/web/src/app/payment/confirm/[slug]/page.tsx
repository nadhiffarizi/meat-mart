'use client';

import { Box, Button, Typography } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import * as React from 'react';

export default function ThankYouPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  // format typography
  const getTypography = (input: string) => {
    return (
      <Typography variant="overline">
        {' '}
        <span className="bg-slate-100 py-2 px-2 rounded-md"> {input}</span>
      </Typography>
    );
  };

  // bg - [#F5F5F5];
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
              Please transfer to {getTypography('BCA 2343534123')} with account
              name
              {getTypography('a.n Meat Mmart Team')}
            </Typography>
            <Typography className="!whitespace-pre">
              Your invoice number{' '}
              <Typography variant="overline">
                {' '}
                {getTypography(params.slug)}
              </Typography>
            </Typography>
            <h3 className="!whitespace-pre">
              Complete payment before{' '}
              <span className="text-red-400">
                {' '}
                {
                  new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
                    .toString()
                    .split('GMT')[0]
                }
              </span>
            </h3>
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
