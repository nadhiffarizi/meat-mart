import { indexCartById, indexProductInCart } from '@/helper/cart.helper';
import { currencyFormatter } from '@/helper/product.helper';
import { ICart } from '@/interface/cart.interface';
import { IDiscount } from '@/interface/discount.interface';
import IProduct from '@/interface/product.interface';
import { addDiscountToCartItem } from '@/redux/slice/cart.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { Box, Button, Radio } from '@mui/material';
import * as React from 'react';
import { discountContext } from '../Cart/DiscountModalInCart.component';

export default function DiscountCard({
  cartId,
  discount,
}: {
  cartId: string;
  discount: IDiscount;
}) {
  const cartState = useAppSelector((state) => state.cartState);
  const dispatch = useAppDispatch();
  const { selectedDiscount, selectDiscount } =
    React.useContext(discountContext)!;

  // localState
  const [isSelected, setSelected] = React.useState<boolean>(false);

  // handle onclick
  const handleSelect = () => {
    // dispatch(addDiscountToCartItem({ product: product, discount: discount }));
    selectDiscount(discount);
  };
  const handleUnselect = () => {
    // dispatch(addDiscountToCartItem({ product: product, discount: discount }));
    selectDiscount(undefined);
  };

  // check discount
  const getDiscountAmount = (discountType: string) => {
    switch (discountType) {
      case 'BOGO':
        return '';
      case 'MINIMUM_BUY':
        if (discount.discount_amount) {
          return ` OFF ${currencyFormatter(discount.discount_amount)}`;
        } else if (discount.discount_percentage) {
          return `OFF ${discount.discount_percentage}`;
        } else {
          return 0;
        }
      case 'CUSTOM':
        if (discount.discount_amount) {
          return `OFF ${currencyFormatter(discount.discount_amount)}`;
        } else if (discount.discount_percentage) {
          return `OFF ${discount.discount_percentage}`;
        } else {
          return 0;
        }
    }
  };

  const getDiscountDescription = (discountType: string) => {
    let stringOuput = '';
    switch (discountType) {
      case 'BOGO':
        return 'Buy 1 Get 1';
      case 'MINIMUM_BUY':
        if (discount.minimum_purchase) {
          stringOuput += ` Min purchase ${currencyFormatter(discount.minimum_purchase)}. `;
        }
        if (discount.maximum_discount_amount) {
          stringOuput += ` Max purchase ${currencyFormatter(discount.maximum_discount_amount)}`;
        }
        return stringOuput;
      case 'CUSTOM':
        if (discount.maximum_discount_amount) {
          stringOuput += ` Max purchase ${currencyFormatter(discount.maximum_discount_amount)}`;
        }
        return stringOuput;
    }
  };

  React.useEffect(() => {
    if (discount.id === selectedDiscount?.id) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [selectedDiscount]);

  React.useEffect(() => {
    if (
      discount.id === cartState[indexCartById(cartState, cartId)].discount?.id
    ) {
      setSelected(true);
      selectDiscount(discount);
    } else {
      console.log('enter');

      setSelected(false);
    }
  }, []);

  return (
    <div
      className={`flex w-full h-[100px] px-2 py-2 rounded-sm ${isSelected ? 'ring-2 ring-secondaryGreen shadow-lg' : 'ring-1'}  `}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          padding: '5px',
        }}
      >
        <div className="flex w-full h-full  rounded-md ">
          <div className="w-4/5 h-full flex flex-col gap-2 justify-center items-start ">
            <p className="text-sm text-red-700 font-semibold">
              {discount.discount_code}{' '}
              {getDiscountAmount(discount.promotion_type!)}{' '}
            </p>
            <small className="text-xs ">
              {getDiscountDescription(discount.promotion_type!)}
            </small>
            {discount.end_date && (
              <small className="text-xs font-light">
                Valid until: {new Date(discount.end_date).toDateString()}
              </small>
            )}
          </div>
          <div className="w-1/5 h-full flex items-center justify-end ">
            {!isSelected ? (
              <Button
                onClick={() => handleSelect()}
                style={{ textTransform: 'none' }}
                className="!bg-secondaryGreen !text-white !rounded-full !w-full"
              >
                Select
              </Button>
            ) : (
              <Button
                onClick={() => handleUnselect()}
                style={{ textTransform: 'none' }}
                className="!bg-slate-400 !text-white !rounded-full !w-full"
              >
                Unselect
              </Button>
            )}
          </div>
        </div>
      </Box>
    </div>
  );
}
