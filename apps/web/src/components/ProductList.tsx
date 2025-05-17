'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { getProducts } from '@/helper/product/product.helper';
import { IProduct } from '@/interface/product/product.interface';
import { IStock } from '@/interface/stock/stocks.interface';

export const ProductList = () => {
  // local state
  const [productData, setProductData] = useState<IProduct[]>();

  useEffect(() => {
    const resProduct = getProducts('products');

    resProduct
      .then((v) => v.json())
      .then((value) => {
        const a: IProduct[] = [];
        value['data'].map((product: any) => {
          const data: IProduct = {
            name: product['name'],
            price: product['price'],
            id: product['id'],
            slug: product['slug'],
            weight: product['weight'],
            image: product['image'],
            availableStocks: product['availableStocks'],
          };
          a.push(data);
        });
        console.log(a);

        setProductData([...a]);
      });
  }, []);

  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0">
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold">Daging Yang Kamu Mau!</h3>
        <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3  lg:grid-cols-5  gap-4 md:ml-10 lg:ml-0">
          {productData &&
            productData.map((product, key) => (
              <Card product={product} key={key} />
            ))}
        </div>
      </div>
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold ">Promo Menarik</h3>
        <div className="m-auto my-5  grid grid-cols-2 text-xs md:text-sm md:grid-cols-3  lg:grid-cols-5 gap-4 md:ml-10 lg:ml-0">
          {productData &&
            productData.map((product, key) => (
              <Card product={product} key={key} />
            ))}
        </div>
      </div>
    </div>
  );
};
