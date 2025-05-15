import { ITransaction } from '@/interface/transaction/transaction.interface';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as React from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Close, MoreHoriz, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { callToast } from '@/helper/notify.helper';
import {
  IOrder,
  OrderChangeContext,
} from '@/interface/transaction/order.interface';
import {
  cancelOrderAPI,
  sendOrderAPI,
} from '@/helper/transaction/order.helper';
import { currencyFormatter } from '@/helper/product/product.helper';

export default function OrderAdminTable({
  orderData,
}: {
  orderData: IOrder[];
}) {
  // global state
  const { data: session } = useSession();
  const orderContext = React.useContext(OrderChangeContext);
  // local state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [orderState, setOrderState] = React.useState<IOrder>();
  const open = Boolean(anchorEl);
  const [openDialog, setDialog] = React.useState<boolean>(false);
  const router = useRouter();

  // handler
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    orderId: string,
    order: IOrder,
  ) => {
    setAnchorEl(event.currentTarget);
    setOrderState({ ...order });
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDialog(false);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!session?.user.access_token) {
      return;
    }
    const response = await cancelOrderAPI(
      'order/admin/cancel',
      { orderId: orderId },
      session?.user.access_token!,
    );

    if (response.status !== 200) {
      callToast('Cancel order failed, try again later', 'ERROR', 2000);
      return;
    }

    const data = (await response.json())['data'];
    console.log(data);

    orderContext?.setChange(!orderContext.isChange);
  };

  const handleSendOrder = async (orderId: string) => {
    if (!session?.user.access_token) {
      return;
    }
    const response = await sendOrderAPI(
      'order/admin/sendorder',
      { orderId: orderId },
      session?.user.access_token!,
    );

    if (response.status !== 200) {
      callToast('Send order failed, try again later', 'ERROR', 2000);
      return;
    }

    const data = (await response.json())['data'];
    console.log(data);

    orderContext?.setChange(!orderContext?.isChange);
  };

  // render menu
  const renderMenu = (order: IOrder) => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="!shadow-white"
      >
        {order.status === 'ON_PROCESS' ? (
          <>
            <MenuItem
              onClick={async () => {
                handleClose();
                await handleSendOrder(order.id);
              }}
            >
              Send Order
            </MenuItem>
            <MenuItem
              onClick={async () => {
                handleClose();
                await handleCancelOrder(order.id);
              }}
            >
              Cancel Order
            </MenuItem>
          </>
        ) : (
          <></>
        )}
        <MenuItem onClick={() => router.push('./order-list')}>Details</MenuItem>
      </Menu>
    );
  };

  return (
    <div className="rounded-md border bg-white">
      {orderState && renderMenu(orderState)}
      {/* {orderState && renderDialog(orderState)} */}
      <Table className="shadow-none">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6 min-w-[300px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className=" text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderData.map((order, index) => (
            <TableRow className={` !h-[50px]`} key={index}>
              <TableCell className="font-medium">
                {order.invoice_number}
              </TableCell>
              <TableCell
                className={`${order.status === 'ON_PROCESS' ? `text-secondaryGreen` : ``}`}
              >
                {order.status.replace('_', ' ')}
              </TableCell>
              <TableCell className="">{order.product_name}</TableCell>
              <TableCell className="text-left">{order.quantity}</TableCell>
              <TableCell className="text-left">
                {currencyFormatter(order.sub_total)}
              </TableCell>
              <TableCell className="text-left">
                {order.created_at.split('T')[0]} <p> </p>
                {order.created_at.split('T')[1].split('.')[0]}
              </TableCell>
              <TableCell className="w-full flex justify-end gap-5 pe-10">
                <IconButton onClick={(e) => handleClick(e, order.id, order)}>
                  <MoreHoriz className="!fill-primaryText" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
