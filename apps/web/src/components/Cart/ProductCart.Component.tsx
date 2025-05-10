import { ICart } from '@/interface/cart/cart.interface';
import { Cancel, Close, Delete } from '@mui/icons-material';
import { Box, Checkbox, IconButton } from '@mui/material';
import * as React from 'react';
import NumberFieldComponent from '../ui/numberfield';
import {
  getCartDataAPI,
  indexCartById,
  subtractCartAPI,
  syncCartDataFromAPI,
} from '@/helper/cart/cart.helper';
import { callToast } from '@/helper/notify.helper';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  removeDiscountFromCart,
  updateCartState,
} from '@/redux/slice/cart.slice';
import DiscountInCartNotif from './DiscountInCartNotif.component';
import { useSession } from 'next-auth/react';
import { currencyFormatter } from '@/helper/product/product.helper';

export default function ProductCart({ cartItem }: { cartItem: ICart }) {
  // global state
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // delete cart item
  const handleSubstractToCart = async (qtty: number) => {
    // call api first
    const resSubCart = await subtractCartAPI(
      'cart/subtract',
      {
        quantity: qtty,
        productId: cartItem.product.id,
      },
      session?.user.access_token!,
    );

    if (resSubCart.status !== 200) {
      callToast('Something went wrong, try again later', 'ERROR', 3000);
      return;
    }

    // get latest cart
    const resGetCart = await getCartDataAPI(
      'cart/get',
      session?.user.access_token!,
    );
    if (resGetCart.status !== 200) {
      callToast('Something went wrong, try again later', 'ERROR', 3000);
      return;
    }

    // sync to local state
    const updatedCart = syncCartDataFromAPI((await resGetCart.json())['data']);
    dispatch(updateCartState(updatedCart));
  };

  const cancelDiscount = (cartId: string) => {
    dispatch(removeDiscountFromCart({ cartId: cartId }));
  };

  return (
    <div
      className="w-full h-[130px] px-5 py-4 flex shadow-sm rounded-md
     bg-white"
    >
      <Box sx={{ width: '50%' }}>
        <div className="w-full h-full  flex">
          <Box
            sx={{
              width: '30%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            {/**image placeholder */}
            <img
              className="w-full rounded-md ring-2 h-full object-cover"
              src={cartItem.product.image || '/templateproduct.png'}
              alt="product-image"
            />
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
            <div className="w-full h-2/3 flex items-center py-1 ">
              <p>{cartItem.product.name}</p>
            </div>
            <div className="w-full h-1/3 flex items-center justify-start gap-3">
              <DiscountInCartNotif cartId={cartItem.id!} />
              {cartItem.discount ? (
                <IconButton onClick={() => cancelDiscount(cartItem.id!)}>
                  <Cancel />
                </IconButton>
              ) : (
                <></>
              )}
            </div>
          </Box>
        </div>
      </Box>
      <Box sx={{ width: '50%' }}>
        <div className="w-full h-full flex ">
          <Box
            sx={{
              width: '40%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <NumberFieldComponent cartItem={cartItem} />
            {cartItem.discount?.promotion_type === 'BOGO' ? (
              <p className="text-sm text-secondaryGreen">
                You get extra {cartItem.quantity} pcs!
              </p>
            ) : (
              <></>
            )}
          </Box>
          <Box
            sx={{
              width: '40%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {currencyFormatter(cartItem.quantity * cartItem.product.price)}
          </Box>
          <Box
            sx={{
              width: '20%',
              display: 'flex',
              // backgroundColor: 'blue',
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
