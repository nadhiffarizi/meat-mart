import {
  ITransaction,
  TrxChangeContext,
} from '@/interface/transaction/transaction.interface';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import * as React from 'react';
import { currencyFormatter } from '@/helper/product/product.helper';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  styled,
} from '@mui/material';
import { Close, MoreHoriz, Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import {
  confirmTransactionAPI,
  rejectTransactionAPI,
} from '@/helper/transaction/transaction.helper';
import { useSession } from 'next-auth/react';
import { callToast } from '@/helper/notify.helper';

export default function TransactionAdminTable({
  trxData,
}: {
  trxData: ITransaction[];
}) {
  // global state
  const { data: session } = useSession();
  const trxContext = React.useContext(TrxChangeContext);
  // local state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [trxState, setTrxState] = React.useState<ITransaction>();
  const open = Boolean(anchorEl);
  const [openDialog, setDialog] = React.useState<boolean>(false);
  const router = useRouter();

  // handler
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    trxId: string,
    trx: ITransaction,
  ) => {
    setAnchorEl(event.currentTarget);
    setTrxState({ ...trx });
  };
  const handleClose = () => {
    setAnchorEl(null);
    setDialog(false);
  };

  const handleRejectPayment = async () => {
    if (!session?.user.access_token) {
      return;
    }
    const response = await rejectTransactionAPI(
      'transaction/admin/rejectpayment',
      { trxId: trxState?.id! },
      session?.user.access_token!,
    );

    if (response.status !== 200) {
      callToast('Reject payment failed, try again later', 'ERROR', 2000);
      return;
    }

    const data = (await response.json())['data'];
    console.log(data);

    trxContext?.setChange(!trxContext.isChange);
  };

  const handleConfirmPayment = async () => {
    if (!session?.user.access_token) {
      return;
    }
    const response = await confirmTransactionAPI(
      'transaction/admin/confirmpayment',
      { trxId: trxState?.id! },
      session?.user.access_token!,
    );

    if (response.status !== 200) {
      callToast('Confirm payment failed, try again later', 'ERROR', 2000);
      return;
    }

    const data = (await response.json())['data'];
    console.log(data);

    trxContext?.setChange(!trxContext.isChange);
  };

  // render menu
  const renderMenu = (trxState: ITransaction) => {
    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        className="!shadow-white"
      >
        {trxState.transaction_status === 'PENDING_ADMIN' &&
        trxState.payment_method === 'MANUAL' ? (
          <>
            <MenuItem
              onClick={async () => {
                handleClose();
                await handleConfirmPayment();
              }}
            >
              Accept Payment
            </MenuItem>
            <MenuItem
              onClick={async () => {
                handleClose();
                await handleRejectPayment();
              }}
            >
              Reject Payment
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
  const renderDialog = (trxState: ITransaction) => {
    const BootstrapDialog = styled(Dialog)(({ theme }) => ({
      '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
      },
      '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
      },
    }));
    return (
      <React.Fragment>
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openDialog}
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Payment Proof
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <Close />
          </IconButton>
          <DialogContent dividers>
            <div className="w-full flex flex-col h-full gap-5">
              <div className="w-full h-full">
                <img
                  className="h-full"
                  src={trxState && trxState.payment_proof}
                />
              </div>
              <div className="w-full h-full flex flex-col">
                {/**Informations */}
                <p className="text-sm text-primaryText">
                  Created at: {trxState.created_at.split('T')[0]}{' '}
                  {trxState.created_at.split('T')[1].split('.')[0]}
                </p>
                <p className="text-sm text-primaryText">
                  Deadline at:{' '}
                  {trxState.deadline_payment.split('T')[0].split('.')[0]}{' '}
                  {trxState.created_at.split('T')[1].split('.')[0]}
                </p>
                <p>
                  Total Transaction: {currencyFormatter(trxState.total_price)}
                </p>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              style={{ textTransform: 'none' }}
              className="!text-orangeAccent !text-base"
              autoFocus
              onClick={handleClose}
            >
              Done
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </React.Fragment>
    );
  };

  return (
    <div className="rounded-md border bg-white">
      {trxState && renderMenu(trxState)}
      {trxState && renderDialog(trxState)}
      <Table className="shadow-none">
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6 min-w-[300px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className=" text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trxData.map((trx, index) => (
            <TableRow className={` !h-[50px]`} key={index}>
              <TableCell className="font-medium">
                {trx.invoice_number.toUpperCase()}
              </TableCell>
              <TableCell>{trx.transaction_status.replace('_', ' ')}</TableCell>
              <TableCell className="">{trx.payment_method}</TableCell>
              <TableCell className="text-left">
                {currencyFormatter(trx.total_price)}
              </TableCell>
              <TableCell className="text-left">
                {trx.created_at.split('T')[0]} <p> </p>
                {trx.created_at.split('T')[1].split('.')[0]}
              </TableCell>
              <TableCell className="w-full flex justify-end gap-5 pe-10">
                {trx.transaction_status === 'PENDING_ADMIN' ? (
                  <IconButton
                    onClick={() => {
                      setDialog(true);
                      setTrxState(trx);
                    }}
                  >
                    <Visibility className="!fill-orangeAccent" />
                  </IconButton>
                ) : (
                  <></>
                )}

                <IconButton onClick={(e) => handleClick(e, trx.id, trx)}>
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
