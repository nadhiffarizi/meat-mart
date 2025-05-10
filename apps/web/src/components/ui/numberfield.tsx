'use client';
import * as React from 'react';
import { NumberField } from '@base-ui-components/react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import styles from './NumberField.module.css';
import { ICart } from '@/interface/cart/cart.interface';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { updateCartState } from '@/redux/slice/cart.slice';
import {
  getCartDataAPI,
  maxStockAvailable,
  syncCartDataFromAPI,
  updateCartQuantity,
} from '@/helper/cart/cart.helper';
import { addToCartAPI } from '@/helper/cart/cart.helper';
import { useState } from 'react';
import { subtractCartAPI } from '@/helper/cart/cart.helper';
import { callToast } from '@/helper/notify.helper';
import { useSession } from 'next-auth/react';

export default function NumberFieldComponent({
  cartItem,
}: {
  cartItem: ICart;
}) {
  // global state
  const dispatch = useAppDispatch();
  // local state
  const id = React.useId();
  const [inputQtty, setInputQtty] = useState<number>(cartItem.quantity);
  const { data: session } = useSession();

  //refresh update local state
  React.useEffect(() => {
    setInputQtty(cartItem.quantity);
  }, []);

  // add to cart handler
  const handleAddToCart = async (qtty: number) => {
    // call api first
    const resAddCart = await addToCartAPI(
      'cart/add',
      {
        quantity: qtty,
        productId: cartItem.product.id,
      },
      session?.user.access_token!,
    );

    if (resAddCart.status !== 200) {
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

  // minus cart item
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

  // handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string for clearing the input
    if (val === '') {
      setInputQtty(1);
      callToast('Quantity cannot be less than 1', 'ERROR', 3000);
      return;
    } else {
      const num = Number(val);
      if (!isNaN(num)) {
        setInputQtty(num);
      }
      return;
    }
  };

  // onkey enter update cart qtty
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      const resUpdateCart = await updateCartQuantity(
        'cart/update',
        {
          quantity: inputQtty,
          productId: cartItem.product.id,
        },
        session?.user.access_token!,
      );

      if (resUpdateCart.status !== 200) {
        callToast('Something went wrong, try again later', 'ERROR', 3000);
      }

      if (inputQtty > maxStockAvailable(cartItem.product).maxStockAvailable) {
        callToast('Maximum stock reached', 'INFO', 3000);
      }

      // get latest cart
      const resGetCart = await getCartDataAPI(
        'cart/get',
        session?.user.access_token!,
      );
      if (resGetCart.status !== 200) {
        callToast('Something went wrong, try again later', 'ERROR', 3000);
      }

      // sync to local state
      const updatedCart = syncCartDataFromAPI(
        (await resGetCart.json())['data'],
      );
      dispatch(updateCartState(updatedCart));
    }
  };
  return (
    <NumberField.Root
      id={id}
      style={{ width: '70%' }}
      max={maxStockAvailable(cartItem.product).maxStockAvailable}
    >
      {/* <label>{maxStockAvailable(cartItem.product).maxStockAvailable}</label> */}
      <NumberField.Group style={{ display: 'flex', flexDirection: 'row' }}>
        <NumberField.Decrement className={styles.Decrement}>
          <MinusIcon
            onClick={async () => {
              // alert(inputQtty);
              console.log(
                `${cartItem.product.name} max stock`,
                maxStockAvailable(cartItem.product).maxStockAvailable,
              );

              if (inputQtty > 1) {
                setInputQtty(inputQtty - 1);
                await handleSubstractToCart(1);
              } else {
                callToast('Input must be more than 1', 'ERROR', 3000);
                return;
              }
            }}
          />
        </NumberField.Decrement>
        <NumberField.Input
          value={inputQtty}
          onChange={(e) => handleChange(e)}
          onKeyDown={handleKeyDown}
          style={{ width: '100%', textAlign: 'center' }}
        />
        <NumberField.Increment className={styles.Increment}>
          <PlusIcon
            onClick={async () => {
              console.log(
                `${cartItem.product.name} max stock`,
                maxStockAvailable(cartItem.product).maxStockAvailable,
              );

              if (
                inputQtty <
                maxStockAvailable(cartItem.product).maxStockAvailable
              ) {
                setInputQtty(inputQtty + 1);
                await handleAddToCart(1);
              }
            }}
          />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  );
}
