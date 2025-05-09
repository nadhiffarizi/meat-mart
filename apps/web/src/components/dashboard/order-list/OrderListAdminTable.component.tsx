import { ITransaction } from '@/interface/transaction.interface';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as React from 'react';
import { currencyFormatter } from '@/helper/product.helper';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Close, MoreHoriz, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { callToast } from '@/helper/notify.helper';
import { IOrder } from '@/interface/order.interface';
import { orderChangeContext } from '@/app/dashboard/order-list/page';
import { cancelOrderAPI, sendOrderAPI } from '@/helper/order.helper';

export default function OrderAdminTable({
  orderData,
}: {
  orderData: IOrder[];
}) {
  // global state
  const { data: session } = useSession();
  const orderContext = React.useContext(orderChangeContext);
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

  // render dialog
  // const renderDialog = (trxState: ITransaction) => {
  //   const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  //     '& .MuiDialogContent-root': {
  //       padding: theme.spacing(2),
  //     },
  //     '& .MuiDialogActions-root': {
  //       padding: theme.spacing(1),
  //     },
  //   }));
  //   return (
  //     <React.Fragment>
  //       <BootstrapDialog
  //         onClose={handleClose}
  //         aria-labelledby="customized-dialog-title"
  //         open={openDialog}
  //       >
  //         <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
  //           Payment Proof
  //         </DialogTitle>
  //         <IconButton
  //           aria-label="close"
  //           onClick={handleClose}
  //           sx={(theme) => ({
  //             position: 'absolute',
  //             right: 8,
  //             top: 8,
  //             color: theme.palette.grey[500],
  //           })}
  //         >
  //           <Close />
  //         </IconButton>
  //         <DialogContent dividers>
  //           <div className="w-full flex flex-col h-full gap-5">
  //             <div className="w-full h-full">
  //               <img
  //                 className="h-full"
  //                 src={trxState && trxState.payment_proof}
  //               />
  //             </div>
  //             <div className="w-full h-full flex flex-col">
  //               {/**Informations */}
  //               <p className="text-sm text-primaryText">
  //                 Created at: {trxState.created_at.split('T')[0]}{' '}
  //                 {trxState.created_at.split('T')[1].split('.')[0]}
  //               </p>
  //               <p className="text-sm text-primaryText">
  //                 Deadline at:{' '}
  //                 {trxState.deadline_payment.split('T')[0].split('.')[0]}{' '}
  //                 {trxState.created_at.split('T')[1].split('.')[0]}
  //               </p>
  //               <p>
  //                 Total Transaction: {currencyFormatter(trxState.total_price)}
  //               </p>
  //             </div>
  //           </div>
  //         </DialogContent>
  //         <DialogActions>
  //           <Button
  //             style={{ textTransform: 'none' }}
  //             className="!text-orangeAccent !text-base"
  //             autoFocus
  //             onClick={handleClose}
  //           >
  //             Done
  //           </Button>
  //         </DialogActions>
  //       </BootstrapDialog>
  //     </React.Fragment>
  //   );
  // };

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
