import { useAppSelector } from '@/redux/store';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export default function PaymentOptions() {
  const [selectedValue, setSelectedValue] = React.useState('manual');
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleSubmit = () => {
    // Do something with selectedValue
    console.log('Chosen option:', selectedValue);
    // maybe send to API or perform logic
    if (selectedValue === 'manual') {
      router.push('./');
    } else {
      router.push('./');
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
            <Button
              onClick={handleSubmit}
              style={{ textTransform: 'none' }}
              className="!bg-secondaryGreen !rounded-full !w-full !h-[40px] !text-base !text-white"
            >
              Proceed to Payment
            </Button>
          </Box>
        </FormControl>
      </div>
    </div>
  );
}
