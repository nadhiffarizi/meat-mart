import { currencyFormatter } from '@/helper/product.helper';
import { ICart } from '@/interface/cart.interface';
import { Cancel, Close, Delete } from '@mui/icons-material';
import { Box, Checkbox, IconButton } from '@mui/material';
import * as React from 'react';
import NumberFieldComponent from '../ui/numberfield';
import {
  getCartDataAPI,
  subtractCartAPI,
  syncCartDataFromAPI,
} from '@/helper/cart.helper';
import { callToast } from '@/helper/notify.helper';
import { useAppDispatch } from '@/redux/store';
import { updateCartState } from '@/redux/slice/cart.slice';

export default function ProductCart({ cartItem }: { cartItem: ICart }) {
  // global state
  const dispatch = useAppDispatch();

  // delete cart item
  const handleSubstractToCart = async (qtty: number) => {
    // call api first
    const resSubCart = await subtractCartAPI('/api/cart/subtract', {
      quantity: qtty,
      productId: cartItem.product.id,
      userId: '1',
    });

    if (resSubCart.status !== 200) {
      callToast('Something went wrong, try again later', 'ERROR', 3000);
      return;
    }

    // get latest cart
    const resGetCart = await getCartDataAPI('/api/cart/get', '1');
    if (resGetCart.status !== 200) {
      callToast('Something went wrong, try again later', 'ERROR', 3000);
      return;
    }

    // sync to local state
    const updatedCart = syncCartDataFromAPI((await resGetCart.json())['data']);
    dispatch(updateCartState(updatedCart));
  };

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
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <NumberFieldComponent cartItem={cartItem} />
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
            <IconButton
              onClick={async () =>
                await handleSubstractToCart(cartItem.quantity)
              }
            >
              <Delete sx={{ fill: 'orange' }} />
            </IconButton>
          </Box>
        </div>
      </Box>
    </div>
  );
}
