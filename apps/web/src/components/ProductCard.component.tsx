import {
  addToCartAPI,
  indexProductInCart,
  isMaxAddedToCart,
} from '@/helper/cart.helper';
import { currencyFormatter } from '@/helper/product.helper';
import IProduct from '@/interface/product.interface';
import IStock from '@/interface/stocks.interface';
import { addToCartState } from '@/redux/slice/cart.slice';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { useState } from 'react';
import * as React from 'react';

export default function ProductCard({ product }: { product: IProduct }) {
  const [isMaxAdded, setMaxAdded] = useState<boolean>();
  const cartState = useAppSelector((select) => select.cartState);
  const dispatch = useAppDispatch();

  const handleAddToCart = (product: IProduct) => {
    dispatch(
      addToCartState({
        product: product,
        qtty: 1,
      }),
    );

    const index = indexProductInCart(cartState, product);
    setMaxAdded(isMaxAddedToCart(cartState[index], product));

    addToCartAPI('/api/cart/add', {
      quantity: 1,
      productId: product.id,
      userId: '1',
    });
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
          {product.Stocks &&
            product.Stocks.map((stock: IStock, index: number) => {
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
            onClick={() => {
              handleAddToCart(product);
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
