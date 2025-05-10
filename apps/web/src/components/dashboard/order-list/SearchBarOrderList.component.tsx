'use client';
import * as React from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { PickerValue } from '@mui/x-date-pickers/internals';
import { callToast } from '@/helper/notify.helper';
import { useSession } from 'next-auth/react';
import { getStoreByAdmin } from '@/helper/store/store.helper';
import IStore from '@/interface/store/store.interface';
import { trxFilterContext } from '@/app/dashboard/transaction-list/page';
import {
  statusFilterToArray,
  statusFilterUpdate,
} from '@/helper/filter/orderFilter.helper';
import { orderFilterContext } from '@/app/dashboard/order-list/page';
import {
  IFilterOrder,
  IFilterStatusOrder,
} from '@/interface/dashboard/filter.interface';

export default function SearchBarOrderListAdmin() {
  // global state
  const filterContext = React.useContext(orderFilterContext);
  const { data: session, status } = useSession();

  // localstate
  const [filterStatus, setStatus] = React.useState<IFilterStatusOrder>({
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
  const [storeOptions, setStoreOptions] = React.useState<IStore[]>();
  const [stores, setStores] = React.useState<IStore[]>([]);

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
      statusArray: statusFilterToArray(filterStatus),
      until: !until ? null : until.toDate().getTime(),
      stores: stores,
    };

    filterContext?.setFilterOrder({ ...filters });
  }, [from, until, filterStatus, invoiceNumber, stores]);

  React.useEffect(() => {
    // request store list
    if (status === 'loading' || status === 'unauthenticated') {
      return;
    }

    const promiseGetStore = getStoreByAdmin(
      'store/list',
      session?.user.access_token!,
    );
    promiseGetStore
      .then((v: any) => {
        if (v.status !== 200)
          throw new Error('Something wrong, try fetching store later');
        return v.json();
      })
      .then((value: any) => {
        console.log(value['data']);
        setStoreOptions([...value['data']]);
      })
      .catch((error: any) => {
        callToast((error as Error).message, 'ERROR', 2000);
      });
  }, [status]);

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

  // onchange stores
  const handleChangeStores = (e: SelectChangeEvent<IStore[]>) => {
    const targetName = (e.target.value as IStore[]).at(
      (e.target.value as IStore[]).length - 1,
    );
    if (!storeOptions) return;

    const indexOption = storeOptions?.findIndex(
      (store) => store.name === String(targetName),
    );

    if (stores.includes(storeOptions[indexOption])) {
      const indexStore = stores.findIndex(
        (store) => store.name === String(targetName),
      );
      const newStores = stores.toSpliced(indexStore, 1);
      setStores([...newStores]);
    } else {
      stores.push(storeOptions[indexOption]);
      setStores([...stores]);
    }
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
    setSearchInput('');
    setFrom(null);
    setUntil(null);
    setStores([]);
  };

  // generate status filter
  const statusBar = () => {
    return (
      <div className=" flex gap-5 w-full overflow-x-auto  px-2 py-2 bg-white ">
        <div className="font-semibold flex items-center">Status</div>
        <div className="h-full flex gap-2 flex-wrap ">
          <Button
            id="btn-waiting-payment"
            style={{ textTransform: 'none' }}
            onClick={() =>
              setStatus(statusFilterUpdate('AWAITING_PAYMENT', filterStatus))
            }
            className={`relative !rounded-full !bg-slate-50 ${filterStatus.AWAITING_PAYMENT ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${filterStatus.AWAITING_PAYMENT ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              Waiting Payment
            </p>
          </Button>
          <Button
            id="btn-canceled"
            style={{ textTransform: 'none' }}
            onClick={() =>
              setStatus(statusFilterUpdate('CANCELED', filterStatus))
            }
            className={`relative !rounded-full !bg-slate-50 ${filterStatus.CANCELED ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${filterStatus.CANCELED ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              Canceled
            </p>
          </Button>
          <Button
            id="btn-pending-admin"
            style={{ textTransform: 'none' }}
            onClick={() =>
              setStatus(statusFilterUpdate('PENDING_ADMIN', filterStatus))
            }
            className={`relative !text-nowrap !rounded-full !bg-slate-50 ${filterStatus.PENDING_ADMIN ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${filterStatus.PENDING_ADMIN ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              Pending Admin
            </p>
          </Button>
          <Button
            id="btn-confirmed-admin"
            style={{ textTransform: 'none' }}
            onClick={() =>
              setStatus(statusFilterUpdate('CONFIRMED_ADMIN', filterStatus))
            }
            className={`relative !text-nowrap !rounded-full !bg-slate-50 ${filterStatus.CONFIRMED_ADMIN ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${filterStatus.CONFIRMED_ADMIN ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              Confirmed Admin
            </p>
          </Button>

          <Button
            id="btn-onprocess"
            style={{ textTransform: 'none' }}
            onClick={() =>
              setStatus(statusFilterUpdate('ON_PROCESS', filterStatus))
            }
            className={`relative !text-nowrap !rounded-full !bg-slate-50 ${filterStatus.ON_PROCESS ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${filterStatus.ON_PROCESS ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              On Process
            </p>
          </Button>
          <Button
            id="btn-ondelivery"
            style={{ textTransform: 'none' }}
            onClick={() =>
              setStatus(statusFilterUpdate('ON_DELIVERY', filterStatus))
            }
            className={`relative !rounded-full !bg-slate-50 ${filterStatus.ON_DELIVERY ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${filterStatus.ON_DELIVERY ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
            >
              On Delivery
            </p>
          </Button>
          <Button
            id="btn-confirm"
            style={{ textTransform: 'none' }}
            onClick={() =>
              setStatus(statusFilterUpdate('CONFIRMED', filterStatus))
            }
            className={`relative !rounded-full !bg-slate-50 ${filterStatus.CONFIRMED ? `!ring-secondaryGreen !ring-2` : `!ring-slate-400 !ring-1`}  !h-fit`}
          >
            <p
              className={`${filterStatus.CONFIRMED ? 'text-secondaryGreen font-medium' : 'text-slate-500'} `}
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
    <div className="w-full flex flex-col bg-white ring-slate-200 ring-1 rounded-md py-3 gap-3 lg:px-5">
      <div className="w-full flex gap-5 bg-white ">
        <div className="w-1/4  h-full ">
          {/** for input search bar */}
          <TextField
            className="!w-full !h-[30px]"
            variant="outlined"
            size="small"
            placeholder="Search invoice here"
            onChange={(e) => handleChange(e)}
            onKeyDown={handleKeyDown}
            value={searchInput}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          ></TextField>
        </div>
        <div className="w-1/4  h-full ">
          <FormControl sx={{ width: '100%' }} size="small">
            <InputLabel
              className=" !text-slate-400"
              id="demo-multiple-checkbox-label"
            >
              Store
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={stores}
              onChange={handleChangeStores}
              input={<OutlinedInput label="Store" />}
              renderValue={(selected) => selected.map((s) => s.name).join(', ')}
              // MenuProps={MenuProps}
            >
              {storeOptions &&
                storeOptions.map((store: IStore, index: number) => (
                  <MenuItem key={index} value={store.name}>
                    <Checkbox
                      checked={
                        stores.findIndex((s) => s.name === store.name) === -1
                          ? false
                          : true
                      }
                    />
                    <ListItemText primary={store.name} />
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
