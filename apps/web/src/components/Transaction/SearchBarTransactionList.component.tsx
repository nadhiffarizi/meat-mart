'use client';
import * as React from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  IFilterStatus,
  IFilterTransactions,
} from '@/interface/dashboard/filter.interface';
import {
  statusFilterToArray,
  statusFilterUpdate,
} from '@/helper/filter/transactionFilter.helper';
import { trxFilterContext } from '@/app/transaction-list/page';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { callToast } from '@/helper/notify.helper';

export default function SearchBarTransactionList() {
  // consume context
  const filterContext = React.useContext(trxFilterContext);

  // localstate
  const [status, setStatus] = React.useState<IFilterStatus>({
    AWAITING_PAYMENT: false,
    CANCELED: false,
    CONFIRMED_ADMIN: false,
    DONE: false,
    PENDING_ADMIN: false,
  });
  const [searchInput, setSearchInput] = React.useState('');
  const [invoiceNumber, setInvoiceNumber] = React.useState('');
  const [from, setFrom] = React.useState<PickerValue>(null);
  const [until, setUntil] = React.useState<PickerValue>(null);

  React.useEffect(() => {
    if (from && until && from.toDate().getTime() > until.toDate().getTime()) {
      callToast('From date cannot less than Until date', 'INFO', 3000);
      setFrom(null);
      setUntil(null);
      return;
    }
    const filters: IFilterTransactions = {
      from: !from ? null : from.toDate().getTime(),
      invoiceNumber: invoiceNumber,
      statusArray: statusFilterToArray(status),
      until: !until ? null : until.toDate().getTime(),
    };

    filterContext?.setFilterTransactions({ ...filters });
  }, [from, until, status, invoiceNumber]);

  // HANDLER
  // onkey enter update cart qtty
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (searchInput === '') {
      return;
    }
    if (event.key === 'Enter') {
      setInvoiceNumber(searchInput);
    }
  };

  // onchange invoice number input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const val = e.target.value;
    // assign to local state
    setSearchInput(val);
    if (val === '') {
      setInvoiceNumber('');
    }
  };

  // onchange from date
  const handleChangeFrom = (newValue: PickerValue | null) => {
    console.log('from Date:', newValue); // Listen to value change
    setFrom(newValue);
  };

  // onchange until date
  const handleChangeUntil = (newValue: PickerValue | null) => {
    console.log('until Date:', newValue); // Listen to value change
    setUntil(newValue);
  };

  // reset button
  const handleResetFilter = () => {
    setStatus({
      AWAITING_PAYMENT: false,
      CANCELED: false,
      CONFIRMED_ADMIN: false,
      DONE: false,
      PENDING_ADMIN: false,
    });

    setInvoiceNumber('');
    setFrom(null);
    setUntil(null);
  };

  // generate status filter
  const statusBar = () => {
    return (
      <div className="w-full lg:h-[70px] flex gap-5 items-center bg-white ">
        <p className="font-semibold">Status</p>
        <Button
          id="btn-waiting-payment"
          style={{ textTransform: 'none' }}
          onClick={() =>
            setStatus(statusFilterUpdate('AWAITING_PAYMENT', status))
          }
          className={`relative !rounded-full !bg-slate-50 ${status.AWAITING_PAYMENT ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
        >
          <p
            className={`${status.AWAITING_PAYMENT ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
          >
            Waiting Payment
          </p>
        </Button>
        <Button
          id="btn-canceled"
          style={{ textTransform: 'none' }}
          onClick={() => setStatus(statusFilterUpdate('CANCELED', status))}
          className={`relative !rounded-full !bg-slate-50 ${status.CANCELED ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
        >
          <p
            className={`${status.CANCELED ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
          >
            Canceled
          </p>
        </Button>
        <Button
          id="btn-pending-admin"
          style={{ textTransform: 'none' }}
          onClick={() => setStatus(statusFilterUpdate('PENDING_ADMIN', status))}
          className={`relative !rounded-full !bg-slate-50 ${status.PENDING_ADMIN ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
        >
          <p
            className={`${status.PENDING_ADMIN ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
          >
            Pending Admin
          </p>
        </Button>
        <Button
          id="btn-confirmed-admin"
          style={{ textTransform: 'none' }}
          onClick={() =>
            setStatus(statusFilterUpdate('CONFIRMED_ADMIN', status))
          }
          className={`relative !rounded-full !bg-slate-50 ${status.CONFIRMED_ADMIN ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
        >
          <p
            className={`${status.CONFIRMED_ADMIN ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
          >
            Confirmed Admin
          </p>
        </Button>
        <Button
          id="btn-done"
          style={{ textTransform: 'none' }}
          onClick={() => setStatus(statusFilterUpdate('DONE', status))}
          className={`relative !rounded-full !bg-slate-50 ${status.DONE ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
        >
          <p
            className={`${status.DONE ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
          >
            Done
          </p>
        </Button>
        <Button
          id="btn-reset"
          style={{ textTransform: 'none' }}
          onClick={handleResetFilter}
          className="relative  !h-fit"
        >
          <p className=" text-secondaryGreen font-semibold">Reset filter</p>
        </Button>
      </div>
    );
  };
  return (
    <div className="w-full lg:h-[150px] flex flex-col bg-white shadow-md rounded-md py-3 lg:px-5">
      <div className="w-full lg:h-[70px] flex gap-5 bg-white ">
        <div className="w-1/2  h-full ">
          {/** for input search bar */}
          <TextField
            className="!w-full !h-[30px]"
            variant="outlined"
            size="small"
            placeholder="Search invoice here"
            onChange={(e) => handleChange(e)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          ></TextField>
        </div>
        <div className="w-1/4 flex gap-5 h-full ">
          {/**for date range */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              slotProps={{ textField: { size: 'small' } }}
              value={from}
              onChange={handleChangeFrom}
              className="!w-full !h-full "
              label="From"
            />
          </LocalizationProvider>
        </div>
        <div className="w-1/4 flex gap-5 h-full ">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              slotProps={{ textField: { size: 'small' } }}
              value={until}
              onChange={handleChangeUntil}
              className="!w-full !h-full"
              label="Until"
            />
          </LocalizationProvider>
        </div>
      </div>
      {statusBar()}
    </div>
  );
}
