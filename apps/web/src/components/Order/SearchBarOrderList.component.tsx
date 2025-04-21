'use client';
import * as React from 'react';
import { ShoppingBagIcon, UserCircleIcon } from '@heroicons/react/16/solid';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useEffect, useState, useRef } from 'react';
import { countTotalInCart } from '@/helper/cart.helper';
import {
  FormControl,
  Icon,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

export default function SearchBarOrderList() {
  // global state
  const cartState = useAppSelector((state) => state.cartState);
  const addressState = useAppSelector((state) => state.addressState);
  const userState = useAppSelector((state) => state.userState);
  const dispatch = useAppDispatch();

  // localstate
  const [status, setStatus] = React.useState('');
  const [searchInput, setSearchInput] = React.useState('');
  const [from, setFrom] = React.useState('');
  const [until, setUntil] = React.useState('');

  const handleChange = (event: any) => {
    setStatus(event.target.value);
  };

  //   useEffect(() => {
  //     const totalQtty = countTotalInCart(cartState);
  //     setTotalLength(totalQtty);
  //   }, [cartState]);
  return (
    <div className="w-full lg:h-[70px] flex gap-5 bg-white shadow-md rounded-md py-3 lg:px-5">
      <div className="w-2/5  h-full ">
        {/** for input search bar */}
        <TextField
          className="!w-full !h-[30px]"
          variant="outlined"
          size="small"
          placeholder="Search invoice here"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        ></TextField>
      </div>
      <div className=" w-1/5 flex h-full rounded-md">
        {/** for input status */}
        <FormControl sx={{ width: '100%' }} size="small">
          <InputLabel id="demo-select-small-label">Status</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={status}
            label="Status"
            onChange={handleChange}
          >
            <MenuItem value="CANCELED">Canceled</MenuItem>
            <MenuItem value="AWAITING_PAYMENT">Waiting Payment</MenuItem>
            <MenuItem value="PENDING_ADMIN">Pending Admin</MenuItem>
            <MenuItem value="ON_PROCESS">On Process</MenuItem>
            <MenuItem value="ON_DELIVERY">On Delivery</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="w-1/5 flex gap-5 h-full ">
        {/**for date range */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{ textField: { size: 'small' } }}
            className="!w-full !h-full "
            label="From"
          />
        </LocalizationProvider>
      </div>
      <div className="w-1/5 flex gap-5 h-full ">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{ textField: { size: 'small' } }}
            className="!w-full !h-full"
            label="Until"
          />
        </LocalizationProvider>
      </div>
    </div>
  );
}
