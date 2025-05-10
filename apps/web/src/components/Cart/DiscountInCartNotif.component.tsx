import { getAvailableDiscountsAPI } from '@/helper/discount.helper';
import { Cancel, Discount, LocalActivity } from '@mui/icons-material';
import { Button, IconButton, Modal } from '@mui/material';
import * as React from 'react';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { DiscountDialogInCart } from './DiscountModalInCart.component';
import { useAppSelector } from '@/redux/store';
import { indexCartById } from '@/helper/cart.helper';
import { useSession } from 'next-auth/react';

export default function DiscountInCartNotif({ cartId }: { cartId: string }) {
  const cartState = useAppSelector((state) => state.cartState);
  const [isDiscountFound, setDiscountFound] = React.useState<boolean>(false);
  const { data: session, status } = useSession();

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
          setDiscountFound(true);
        }
      });
  }, [cartState, status]);

  // handle modal open

  return (
    <div className=" h-full">
      {isDiscountFound && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              style={{ textTransform: 'none' }}
              className="!text-xs !text-red-400 "
              startIcon={<Discount />}
            >
              {cartState[indexCartById(cartState, cartId)].discount
                ? `${cartState[indexCartById(cartState, cartId)].discount?.discount_code} applied`
                : 'Check Available Discounts'}
            </Button>
          </DialogTrigger>
          <DiscountDialogInCart cartId={cartId} />
        </Dialog>
      )}
    </div>
  );
}
