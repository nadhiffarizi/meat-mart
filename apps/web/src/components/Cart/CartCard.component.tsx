import { currencyFormatter } from '@/helper/product.helper';
import { ICart } from '@/interface/cart.interface';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Close } from '@mui/icons-material';
import { IconButton, MenuItem } from '@mui/material';
import { subtractCartState } from '@/redux/slice/cart.slice';
import { subtractCartAPI } from '@/helper/cart.helper';
import * as React from 'react';
import { useSession } from 'next-auth/react';

export default function CartCard({ cartItem }: { cartItem: ICart }) {
  // get global state
  const cartState = useAppSelector((state) => state.cartState);
  const dispatch = useAppDispatch();
  const { data: session } = useSession();

  // handler
  const removeProduct = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    // update state
    dispatch(
      subtractCartState({
        product: cartItem.product,
        qtty: cartItem.quantity,
      }),
    );

    // call cart service to update cart
    subtractCartAPI(
      'cart/subtract',
      {
        productId: cartItem.product.id,
        quantity: cartItem.quantity,
      },
      session?.user.access_token!,
    );
  };

  return (
    <React.Fragment>
      <MenuItem
        className="flex gap-3 w-full h-[80px]"
        sx={{
          fontSize: '14px',
          fontFamily: '__Inter_d65c78, __Inter_Fallback_d65c78',
          padding: 0,
        }}
      >
        <div className="w-1/4 h-full bg-blue-200 flex items-center ring-1 rounded-md ">
          <img
            width={216}
            height={100}
            className="h-full rounded-lg object-cover"
            src={cartItem.product.image || '/templateproduct.png'}
            alt="product-image"
          />
        </div>
        <div className="w-1/2 h-full ">
          <div className="w-full h-1/2 overflow-hidden">
            <small className="text-sm ">{cartItem.product.name}</small>
          </div>
          <div className="w-full h-1/2 ">
            <small>
              {cartItem.quantity} x{' '}
              {currencyFormatter(cartItem.product.price!)}{' '}
            </small>
          </div>
        </div>
        <div className="flex justify-end w-1/4 h-full ">
          {' '}
          <IconButton className="!h-[40px]" onClick={(e) => removeProduct(e)}>
            <Close />
          </IconButton>
        </div>
      </MenuItem>
    </React.Fragment>
  );
}
