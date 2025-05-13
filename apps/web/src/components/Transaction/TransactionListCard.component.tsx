'use client';
import { trxChangeContext } from '@/app/transaction-list/page';
import { callToast } from '@/helper/notify.helper';
import { currencyFormatter } from '@/helper/product/product.helper';
import {
  cancelTransactionAPI,
  uploadPaymentProof,
} from '@/helper/transaction/transaction.helper';
import { ITransaction } from '@/interface/transaction/transaction.interface';
import { ShoppingBag } from '@mui/icons-material';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import { Files } from 'lucide-react';
import { useSession } from 'next-auth/react';
import * as React from 'react';

export default function TransactionListCard({ trx }: { trx: ITransaction }) {
  // global state
  const changeStatus = React.useContext(trxChangeContext);
  const { data: session, status } = useSession();

  //local state
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // handler
  const handleCancel = async (trxId: string, userId: string) => {
    try {
      setLoading(true);
      const resCancel = await cancelTransactionAPI(
        'transaction/cancel',
        {
          trxId: trx.id,
        },
        session?.user.access_token!,
      );

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
  const handleUploadPayment = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (!file || file.length === 0) {
      console.log('no file selected');
      return;
    }

    // call api to upload
    try {
      setLoading(true);
      // create formdata
      const payload = new FormData();
      payload.append('image', file[0]);
      payload.append('trxId', trx.id);
      const resUpload = await uploadPaymentProof(
        'transaction/upload/paymentproof',
        session?.user.access_token!,
        payload,
      );

      if (resUpload.status !== 200) throw new Error('error uploading file');

      const result = (await resUpload.json())['data'];
      console.log(result);

      callToast('Upload payment proof success', 'INFO', 3000);

      // set change
      changeStatus?.setChange(!changeStatus.isChange);

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
          {status.split('_').join(' ')}
        </span>
      </Typography>
    );
  };

  const buttonTrxStatus = (status: string) => {
    switch (status) {
      case 'AWAITING_PAYMENT':
        if (!trx.payment_proof) {
          return (
            <Button
              style={{ textTransform: 'none' }}
              onClick={() => handleUploadPayment()}
              className={`!rounded-md ${isLoading ? '!bg-slate-400  ' : '!bg-secondaryGreen !ring-secondaryGreen !ring-2'} !w-[200px] !text-white !font-semibold`}
            >
              Upload Payment Proof
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e)}
              />
            </Button>
          );
        }
        break;
      case 'CANCELED':
        return (
          <Button
            style={{ textTransform: 'none' }}
            disabled
            className="!rounded-md !w-[200px] !text-slate-400 !font-semibold"
          >
            Canceled
          </Button>
        );
        break;
      default:
        return (
          <Button
            style={{ textTransform: 'none' }}
            disabled
            className="!rounded-md !w-[200px] !text-slate-400 !font-semibold"
          >
            Paid
          </Button>
        );
        break;
    }
  };

  return (
    <div
      className="w-full max-w-[2000px] flex flex-col py-3 px-5 gap-2 border-b-2
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
        <div className="w-2/5 flex items-center justify-end gap-5">
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
        <div className="w-full  flex justify-between gap-3">
          <div className="w-1/4 max-w-[100px] max-h-[300px] bg-white">
            {/**image div */}
            <img
              width={200}
              height={200}
              src={`${trx.payment_method === 'MANUAL' ? './banktransfer.png' : './midtrans2.png'}`}
            />
          </div>
          <div className="w-full h-full max-h-[300px] flex gap-2 py-3 px-3 bg-white ">
            <div className=" h-full max-h-[300px] flex flex-col py-3 px-3 bg-white ">
              <p className="text-slate-600 text-sm">Payment Method</p>
              <p className="font-semibold">{trx.payment_method}</p>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className="h-full max-h-[300px] flex flex-col py-3 px-3 bg-white ">
              {trx.payment_method === 'MANUAL' ? (
                <>
                  <p className="text-slate-600 text-sm">
                    Payment Account Number
                  </p>
                  <p className="font-semibold">49123301293</p>
                </>
              ) : (
                <>
                  <p className="text-slate-600 text-sm">
                    Payment Account Number
                  </p>
                  <p className="text-slate-400 italic">Provided by Midtrans</p>
                </>
              )}
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

          {buttonTrxStatus(trx.transaction_status)}
        </div>
      </Box>
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
