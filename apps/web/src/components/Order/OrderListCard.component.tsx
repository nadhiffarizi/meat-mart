import { orderChangeContext } from '@/app/order-list/page';
import { callToast } from '@/helper/notify.helper';
import { confirmOrderAPI } from '@/helper/transaction/order.helper';
import { currencyFormatter } from '@/helper/product.helper';
import { IOrder } from '@/interface/transaction/order.interface';
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
import { useSession } from 'next-auth/react';
import * as React from 'react';

export default function OrderListCard({ orderData }: { orderData: IOrder }) {
  // global state
  const changeStatus = React.useContext(orderChangeContext);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const { data: session, status } = useSession();

  // handler
  const handleConfirm = async (orderId: string) => {
    try {
      setLoading(true);
      const resConfirm = await confirmOrderAPI(
        'order/confirm',
        {
          orderId: orderId,
        },
        session?.user.access_token!,
      );

      if (resConfirm.status !== 200)
        throw new Error('confirm order error, try again later');

      changeStatus?.setChange(!changeStatus.isChange);

      setLoading(false);
    } catch (error) {
      callToast((error as Error).message, 'ERROR', 2000);
      setLoading(false);
    }
  };

  // formatter component
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
          <p className="text-xs">Purchase</p>
          <p className="text-xs text-secondaryGreen">
            Created at {orderData.created_at.split('T')[0]}
          </p>
          <>{statusFormatter(orderData.status)}</>
          {/* <p>{ orderData.}</p> */}
        </div>
      </Box>
      <Box sx={{ width: '100%', height: '60%' }}>
        <div className="w-full h-full  flex justify-between gap-3">
          <div className="w-1/4 max-w-[100px] h-full max-h-[300px] bg-white">
            {/**image div */}
            <img
              width={216}
              height={100}
              className="w-full rounded-lg h-[150px] lg:h-[150px] object-cover"
              src={orderData.product.image || '/templateproduct.png'}
              alt="product-image"
            />
          </div>
          <div className="w-full h-full max-h-[300px] flex flex-col py-3 px-3 bg-white ">
            <p className="font-semibold">{orderData.product.name}</p>
            <p className="text-sm">X {orderData.quantity}</p>
          </div>
          <Divider orientation="vertical" sx={{ bgcolor: 'green' }} flexItem />
          <div className="w-1/2 max-w-[200px] h-full max-h-[300px] flex flex-col justify-center py-3 px-3 bg-white ">
            <p className="font-semibold">Total Purchase</p>
            <p>{currencyFormatter(orderData.sub_total)}</p>
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
          {orderData.status === 'ON_DELIVERY' ? (
            <Button
              style={{ textTransform: 'none' }}
              onClick={async () => await handleConfirm(orderData.id)}
              className="!rounded-md !ring-secondaryGreen !w-[200px] !ring-2 !text-secondaryGreen !font-semibold"
            >
              Confirm Order
            </Button>
          ) : (
            <></>
          )}

          <Button
            style={{ textTransform: 'none' }}
            className="!rounded-md !bg-secondaryGreen !ring-secondaryGreen !ring-2 !w-[200px] !text-white !font-semibold"
          >
            Buy Again
          </Button>
        </div>
      </Box>
      <Backdrop open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
