import { currencyFormatter } from '@/helper/product.helper';
import { ICart } from '@/interface/cart.interface';
import { Box, IconButton } from '@mui/material';
import * as React from 'react';

export default function ItemCard({ cartItem }: { cartItem: ICart }) {
  return (
    <div
      className="w-full h-[100px]  flex border-b-2
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
              paddingBottom: '.7em',
            }}
          >
            {/**image placeholder */}
            <img
              className="w-full h-full rounded-lg object-cover"
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
            <div className="w-full h-2/3  flex flex-col items-start gap-2 px-2">
              <p>{cartItem.product.name}</p>
              {cartItem.discount && (
                <p className="text-sm text-secondaryGreen">
                  Discount{' '}
                  <span className="font-semibold">
                    {cartItem.discount.discount_code}
                  </span>{' '}
                  applied!
                </p>
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
            {cartItem.discount?.promotion_type === 'BOGO' ? (
              <p className="text-sm text-secondaryGreen">
                x {cartItem.quantityAfterDisc}
              </p>
            ) : (
              <p>x {cartItem.quantity}</p>
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
        </div>
      </Box>
    </div>
  );
}
