'use client';
import { trxChangeContext } from '@/app/transaction-list/page';
import { callToast } from '@/helper/notify.helper';
import { currencyFormatter } from '@/helper/product.helper';
import { cancelTransactionAPI } from '@/helper/transaction.helper';
import { ITransaction } from '@/interface/transaction.interface';
import { ShoppingBag } from '@mui/icons-material';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import * as React from 'react';

export default function TransactionListCard({ trx }: { trx: ITransaction }) {
  // global state
  const changeStatus = React.useContext(trxChangeContext);

  //local state
  const [isLoading, setLoading] = React.useState<boolean>(false);
  // handler
  const handleCancel = async (trxId: string, userId: string) => {
    try {
      setLoading(true);
      const resCancel = await cancelTransactionAPI('transaction/cancel', {
        trxId: trx.id,
        userId: '1',
      });

      if (resCancel.status !== 200)
        throw new Error('Cancel transaction failed, try again later ');

      const trxCanceled = (await resCancel.json())['data'];
      console.log(trxCanceled);
      changeStatus?.setChange(!changeStatus.isChange);

      // set global state

      setLoading(false);
    } catch (error) {
      callToast((error as Error).message, 'ERROR', 2000);
      setLoading(false);
    }
  };

  // styling
  const statusFormatter = (status: string) => {
    return (
      <Typography variant="overline">
        <span className="text-xs bg-slate-100 py-1 px-2 rounded-md font-semibold text-secondaryGreen">
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
      <Box
        sx={{
          width: '100%',
          height: '20%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div className="w-full h-full flex items-center gap-5 ">
          <ShoppingBag className="!fill-transparent !stroke-black !h-full" />
          <p className="font-semibold text-xs">{trx.invoice_number}</p>
          <p className="text-xs">Created: {trx.created_at.split('T')[0]}</p>
          <>{statusFormatter(trx.transaction_status)}</>
        </div>
        <div className="w-2/5 h-full flex items-center justify-end gap-5">
          <p className="text-xs">
            Pay before:{' '}
            <span className="text-yellow-500 text-xs">
              {' '}
              {trx.deadline_payment.split('T')[0]}
            </span>
          </p>
        </div>
      </Box>
      <Box sx={{ width: '100%', height: '60%' }}>
        <div className="w-full h-full  flex justify-between gap-3">
          <div className="w-1/4 max-w-[100px] h-full max-h-[300px] bg-white">
            {/**image div */}
            payment photo
          </div>
          <div className="w-full h-full max-h-[300px] flex gap-2 py-3 px-3 bg-white ">
            <div className=" h-full max-h-[300px] flex flex-col py-3 px-3 bg-white ">
              <p className="text-slate-600 text-sm">Payment Method</p>
              <p className="font-semibold">{trx.payment_method}</p>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="h-full max-h-[300px] flex flex-col py-3 px-3 bg-white ">
              <p className="text-slate-600 text-sm">Payment Account Number</p>
              <p className="font-semibold">49123301293</p>
            </div>
          </div>
          <Divider orientation="vertical" sx={{ bgcolor: 'green' }} flexItem />
          <div className="w-1/2 max-w-[200px] h-full max-h-[300px] flex flex-col justify-center py-3 px-3 bg-white ">
            <p className="font-semibold">Total Purchase</p>
            <p>{currencyFormatter(trx.total_price)}</p>
          </div>
        </div>
      </Box>
      <Box sx={{ width: '100%', height: '20%' }}>
        <div className="w-full h-full py-1 flex justify-end gap-7">
          <Button
            style={{ textTransform: 'none' }}
            className=" !w-[200px]  !text-secondaryGreen !font-semibold"
          >
            Transaction Detail
          </Button>
          {trx.transaction_status === 'AWAITING_PAYMENT' ? (
            <Button
              style={{ textTransform: 'none' }}
              onClick={async () => handleCancel(trx.id, '1')}
              className="!rounded-md !ring-secondaryGreen !w-[200px] !ring-2 !text-secondaryGreen !font-semibold"
            >
              Cancel Purchase
            </Button>
          ) : (
            <></>
          )}

          <Button
            style={{ textTransform: 'none' }}
            className="!rounded-md !bg-secondaryGreen !ring-secondaryGreen !ring-2 !w-[200px] !text-white !font-semibold"
          >
            Upload Payment Proof
          </Button>
        </div>
      </Box>
    </div>
  );
}
