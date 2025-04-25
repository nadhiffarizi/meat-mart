'use client';
import * as React from 'react';
import { Button, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  IFilterOrder,
  IFilterStatus,
  IFilterStatusOrder,
  IFilterTransactions,
} from '@/interface/filter.interface';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { callToast } from '@/helper/notify.helper';
import {
  statusFilterToArray,
  statusFilterUpdate,
} from '@/helper/filter/orderFilter.helper';
import { orderFilterContext } from '@/app/order-list/page';

export default function SearchBarOrderList() {
  // consume context
  const filterContext = React.useContext(orderFilterContext);

  // localstate
  const [status, setStatus] = React.useState<IFilterStatusOrder>({
    AWAITING_PAYMENT: false,
    CANCELED: false,
    CONFIRMED_ADMIN: false,
    CONFIRMED: false,
    PENDING_ADMIN: false,
    ON_DELIVERY: false,
    ON_PROCESS: false,
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
    const filters: IFilterOrder = {
      from: !from ? null : from.toDate().getTime(),
      invoiceNumber: invoiceNumber,
      statusArray: statusFilterToArray(status),
      until: !until ? null : until.toDate().getTime(),
    };

    filterContext?.setFilterOrder({ ...filters });
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
      CONFIRMED: false,
      PENDING_ADMIN: false,
      ON_DELIVERY: false,
      ON_PROCESS: false,
    });

    setInvoiceNumber('');
    setFrom(null);
    setUntil(null);
  };

  // generate status filter
  const statusBar = () => {
    return (
      <div className=" flex gap-5 w-full overflow-x-auto lg:h-[110px] px-2 py-2 bg-white ">
        <div className="h-full ">
          <span className="font-semibold">Status</span>
        </div>
        <div className="h-full flex gap-2 flex-wrap ">
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
            onClick={() =>
              setStatus(statusFilterUpdate('PENDING_ADMIN', status))
            }
            className={`relative !text-nowrap !rounded-full !bg-slate-50 ${status.PENDING_ADMIN ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
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
            className={`relative !text-nowrap !rounded-full !bg-slate-50 ${status.CONFIRMED_ADMIN ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${status.CONFIRMED_ADMIN ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              Confirmed Admin
            </p>
          </Button>

          <Button
            id="btn-onprocess"
            style={{ textTransform: 'none' }}
            onClick={() => setStatus(statusFilterUpdate('ON_PROCESS', status))}
            className={`relative !text-nowrap !rounded-full !bg-slate-50 ${status.ON_PROCESS ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${status.ON_PROCESS ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              On Process
            </p>
          </Button>
          <Button
            id="btn-ondelivery"
            style={{ textTransform: 'none' }}
            onClick={() => setStatus(statusFilterUpdate('ON_DELIVERY', status))}
            className={`relative !rounded-full !bg-slate-50 ${status.ON_DELIVERY ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${status.ON_DELIVERY ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              On Delivery
            </p>
          </Button>
          <Button
            id="btn-confirm"
            style={{ textTransform: 'none' }}
            onClick={() => setStatus(statusFilterUpdate('CONFIRMED', status))}
            className={`relative !rounded-full !bg-slate-50 ${status.CONFIRMED ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${status.CONFIRMED ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              Confirmed
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
      </div>
    );
  };
  return (
    <div className="w-full lg:h-[200px] flex flex-col bg-white shadow-md rounded-md py-3 lg:px-5">
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
