import {
  createTransactionAPI,
  createTransactionPayload,
} from '@/helper/checkout.helper';
import { callToast } from '@/helper/notify.helper';
import { useAppSelector } from '@/redux/store';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function PaymentOptions() {
  // global state
  const cartState = useAppSelector((state) => state.cartState);
  const userId = useAppSelector((state) => state.userState);

  //local state
  const [isLoading, setLoading] = React.useState<Boolean>(false);
  const [selectedValue, setSelectedValue] = React.useState('manual');
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     console.log('test');
      //     resolve('');
      //   }, 2000);
      // });

      // Do something with selectedValue
      if (selectedValue === 'manual') {
        const resPostTrx = await createTransactionAPI(
          '/api/transaction/create',
          createTransactionPayload(cartState, userId.id),
        );
        if (resPostTrx.status !== 200) {
          callToast('Error creating transaction, try again', 'ERROR', 2000);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      router.push(`/payment/confirm/${'InvoiceNumber'}`);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 ">
      <div className="h-1/4 w-full flex items-center">
        <h1 className="text-xl text-black font-semibold">
          Choose Payment Options
        </h1>
      </div>
      <div className="h-3/4  w-full  py-3 px-3">
        <FormControl className="!w-full !h-full !flex !flex-col !justify-between !gap-2">
          <RadioGroup
            className="!w-full !h-full !flex !flex-col !justify-between !gap-5"
            aria-labelledby="radio-group-label"
            name="example-radio-group"
            value={selectedValue}
            onChange={handleChange}
          >
            <FormControlLabel
              value="automatic"
              control={<Radio />}
              label="Pay instantly with card (recommended) "
            />
            <FormControlLabel
              value="manual"
              control={<Radio />}
              label="Pay with manual transfer"
            />
          </RadioGroup>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'end',
            }}
          >
            {!isLoading ? (
              <Button
                onClick={async () => await handleSubmit()}
                style={{ textTransform: 'none' }}
                className="!bg-secondaryGreen !rounded-full !w-full !h-[40px] !text-base !text-white"
              >
                Proceed to Payment
              </Button>
            ) : (
              <Button
                style={{ textTransform: 'none', display: 'flex' }}
                startIcon={<CircularProgress size={20} color="inherit" />}
                className="!bg-slate-400 !rounded-full !w-full !h-[40px] !text-base !text-white"
              >
                Processing..
              </Button>
            )}
          </Box>
        </FormControl>
      </div>
    </div>
  );
}
