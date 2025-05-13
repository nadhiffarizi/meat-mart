import {
  addToCartAPI,
  getCartDataAPI,
  indexProductInCart,
  isMaxAddedToCart,
  syncCartDataFromAPI,
} from '@/helper/cart/cart.helper';
import { currencyFormatter } from '@/helper/product/product.helper';
import IProduct from '@/interface/product/product.interface';
import IStock from '@/interface/stock/stocks.interface';
import { addToCartState, updateCartState } from '@/redux/slice/cart.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import * as React from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function ProductCard({ product }: { product: IProduct }) {
  const [isMaxAdded, setMaxAdded] = useState<boolean>();
  const cartState = useAppSelector((select) => select.cartState);
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();

  //local state
  const [errorFetch, setErrorFetch] = useState<boolean>(false);

  const handleAddToCart = async (product: IProduct) => {
    // call api first
    const resAddCart = await addToCartAPI(
      'cart/add',
      {
        quantity: 1,
        productId: product.id,
      },
      session?.user.access_token!,
    );

    if (resAddCart.status !== 200) {
      toast.error('Something went wrong, try again later');
      return;
    }

    // get latest cart
    const resGetCart = await getCartDataAPI('cart/get', '1');
    if (resGetCart.status !== 200) {
      toast.error('Something went wrong, try again later');
      return;
    }

    // sync to local state
    const updatedCart = syncCartDataFromAPI((await resGetCart.json())['data']);
    dispatch(updateCartState(updatedCart));

    const index = indexProductInCart(cartState, product);
    setMaxAdded(isMaxAddedToCart(cartState[index], product));
  };

  return (
    <div className="flex flex-col w-1/6 max-w-[300px] h-4/5 max-h-[700px] bg-slate-100 ring-2 rounded-md shadow-md py-5 px-5 gap-5">
      <div className="w-full h-1/2 max-h-[500px] bg-blue-300">
        {/**image div */}
      </div>

      <div className="flex flex-col justify-between w-full h-1/2 max-h-[700px]  gap-1">
        <p>{product.name}</p>
        <small>{currencyFormatter(product.price)}</small>
        <small className="text-red-500">Available Stocks</small>
        <div className="flex gap-2">
          {product.availableStocks &&
            product.availableStocks.map((stock: IStock, index: number) => {
              return (
                <small key={index}>
                  {stock.stores.status} :{stock.quantity}
                </small>
              );
            })}
        </div>
        {isMaxAdded ? (
          <button className="bg-slate-500 h-[50px] text-white">
            Add to Cart
          </button>
        ) : (
          <button
            onClick={async () => {
              await handleAddToCart(product);
            }}
            className="bg-black h-[50px] text-white"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
