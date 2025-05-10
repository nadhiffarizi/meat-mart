import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@mui/material';
import DiscountCard from '../Discount/DiscountCard.component';
import {
  getAvailableDiscountsAPI,
  redeemDiscountAPI,
  syncDiscountDataFromAPI,
} from '@/helper/discount.helper';
import { IDiscount } from '@/interface/discount.interface';
import { callToast } from '@/helper/notify.helper';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addDiscountToCartItem } from '@/redux/slice/cart.slice';
import { useSession } from 'next-auth/react';

interface DiscountContextType {
  selectedDiscount: IDiscount | undefined;
  selectDiscount: (discount: IDiscount | undefined) => void;
}

export const discountContext = React.createContext<
  DiscountContextType | undefined
>(undefined);

export function DiscountDialogInCart({ cartId }: { cartId: string }) {
  const cartState = useAppSelector((state) => state.cartState);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  //local state
  const [availableDiscounts, setAvailableDiscounts] =
    React.useState<IDiscount[]>();
  const [selectedDiscount, selectDiscount] = React.useState<
    IDiscount | undefined
  >(undefined);

  //callbacks
  const handleSubmit = async (cartId: string, discount?: IDiscount) => {
    if (!discount) {
      callToast('Please select your voucher', 'INFO', 1000);
      return;
    }

    const resRedeemDisc = await redeemDiscountAPI(
      'discount/redeem',
      {
        cartId: cartId,
        discountId: discount?.id!,
      },
      session?.user.access_token!,
    );

    if (resRedeemDisc.status !== 200) {
      callToast('Failed to redeem discount', 'ERROR', 2000);
      return;
    }

    // console.log((await resRedeemDisc.json())['data']);

    const redeemData = (await resRedeemDisc.json())['data'];
    dispatch(addDiscountToCartItem({ data: redeemData, cartId: cartId }));
  };

  React.useEffect(() => {
    if (status === 'loading' || status === 'unauthenticated') {
      return;
    }
    const resGetDiscount = getAvailableDiscountsAPI(
      `discount/get/${cartId}`,
      session?.user.access_token!,
    );

    resGetDiscount
      .then((v) => v.json())
      .then((value) => {
        if (value['data'].length) {
          setAvailableDiscounts(syncDiscountDataFromAPI(value['data']));
        }
      });
  }, [cartState, status]);

  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle className="text-2xl px-3">
          Available Discounts for You
        </DialogTitle>
      </DialogHeader>
      <div className="w-full  h-[350px] flex flex-col gap-4 px-5 py-3 overflow-auto">
        <discountContext.Provider value={{ selectedDiscount, selectDiscount }}>
          {availableDiscounts &&
            availableDiscounts.map((discountOption, index: number) => {
              return (
                <DiscountCard
                  discount={discountOption}
                  cartId={cartId}
                  key={index}
                />
              );
            })}
        </discountContext.Provider>
      </div>
      <DialogFooter className="h-[40px] px-5">
        <DialogClose asChild>
          <Button
            style={{ textTransform: 'none' }}
            onClick={async () => handleSubmit(cartId, selectedDiscount)}
            className="!bg-secondaryGreen !text-white !rounded-full !px-7 py-3"
            type="submit"
          >
            Redeem Voucher
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
