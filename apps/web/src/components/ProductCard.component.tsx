'use client';
import { apiRequest } from '@/helper/api.helper';
import { addToCart } from '@/helper/cart.helper';
import IProduct from '@/interface/product.interface';
import * as React from 'react';

export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <div className="flex flex-col w-1/6 max-w-[300px] h-2/3 max-h-[500px] bg-slate-100 ring-2 rounded-md shadow-md py-5 px-5 gap-5">
      <div className="w-full h-2/3 max-h-[500px] bg-blue-300">
        {/**image div */}
      </div>

      <div className="flex flex-col justify-between w-full h-1/3 max-h-[500px]  gap-1">
        <p>{product.name}</p>
        <small>{product.price}</small>
        <button
          onClick={async () => {
            await addToCart('/api/cart/add', product.id);
          }}
          className="bg-black h-full text-white"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
