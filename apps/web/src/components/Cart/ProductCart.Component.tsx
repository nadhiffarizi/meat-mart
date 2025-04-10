import { currencyFormatter } from '@/helper/product.helper';
import { ICart } from '@/interface/cart.interface';
import { Cancel, Close, Delete } from '@mui/icons-material';
import { Box, Checkbox, IconButton } from '@mui/material';
import { Icon } from 'lucide-react';
import * as React from 'react';

export default function ProductCart({ cartItem }: { cartItem: ICart }) {
  return (
    <div
      className="w-full h-[150px] grid grid-cols-2 shadow-sm rounded-md
     bg-white"
    >
      <Box sx={{ width: '100%' }}>
        <div className="w-full h-full py-5 flex">
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '.7rem',
              paddingRight: '.7rem',
              gap: '10px',
            }}
          >
            {/**image placeholder */}
            <Checkbox color="success" />
            Image placeholder
          </Box>
          <Box
            sx={{
              width: '70%',
              display: 'flex',
              alignItems: 'start',
              justifyContent: 'center',
              paddingLeft: '.7rem',
              flexDirection: 'column',
            }}
          >
            <p>{cartItem.product.name}</p>
            <p>Availabe Discount</p>
          </Box>
        </div>
      </Box>
      <Box sx={{ width: '100%' }}>
        <div className="w-full h-full grid grid-cols-4 ">
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              fontWeight: '400',
            }}
          >
            <p>{currencyFormatter(cartItem.product.price)}</p>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p>{cartItem.quantity}</p>
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {currencyFormatter(cartItem.quantity * cartItem.product.price)}
          </Box>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton>
              <Delete sx={{ fill: 'orange' }} />
            </IconButton>
          </Box>
        </div>
      </Box>
    </div>
  );
}
