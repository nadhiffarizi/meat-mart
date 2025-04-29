import { subtractCartAPI } from '@/helper/cart.helper';
import { currencyFormatter } from '@/helper/product.helper';
import { ICart } from '@/interface/cart.interface';
import { subtractCartState } from '@/redux/slice/cart.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { XIcon } from 'lucide-react';
import * as React from 'react';
export default function Dropdowncard({ cartItem }: { cartItem: ICart }) {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.userState);

  const removeProduct = () => {
    // update state
    dispatch(
      subtractCartState({
        product: cartItem.product,
        qtty: cartItem.quantity,
      }),
    );

    // call cart service to update cart
    subtractCartAPI('/api/cart/subtract', {
      productId: cartItem.product.id,
      quantity: cartItem.quantity,
      userId: userState.id,
    });
  };
  return (
    <div className="w-full h-[70px] bg-white mb-3 rounded-sm">
      <div className="w-full h-full grid grid-cols-4">
        <div className="w-full h-full col-span-1 ">
          <img
            width={216}
            height={100}
            className="w-full rounded-lg h-[150px] lg:h-[150px] object-cover"
            src={cartItem.product.image || '/templateproduct.png'}
            alt="product-image"
          />
        </div>
        <div className="flex flex-col w-full h-full col-span-2 ">
          <div className="w-full h-1/2 ">
            <small className="text-sm">{cartItem.product.name}</small>
          </div>
          <div className="w-full h-1/2 ">
            <small>
              {cartItem.quantity} x{' '}
              {currencyFormatter(cartItem.product.price!)}{' '}
            </small>
          </div>
        </div>
        <div className=" flex justify-center items-center w-full h-full col-span-1 ">
          <XIcon onClick={() => removeProduct()} className="stroke-red-400" />
        </div>
      </div>
    </div>
  );
}
