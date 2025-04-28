'use client';
import { apiRequest } from '@/helper/api.helper';
import * as React from 'react';
import ProductCard from './ProductCard.component';
import IProduct from '@/interface/product.interface';
import { getProducts } from '@/helper/product.helper';
import { useEffect, useState } from 'react';
export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>();

  useEffect(() => {
    const res = getProducts('products');

    res
      .then((v) => v.json())
      .then((values) => {
        const data = values['data'];
        console.log(data);

        setProducts(data);
      });
  }, []);

  return (
    <div className="w-full h-3/4 max-h-[700px]  py-20 px-10">
      <div className="flex justify-around items-center w-full h-full gap-5 py-5 px-10">
        {products &&
          products?.map((product, index: number) => {
            const data: IProduct = {
              name: product['name'],
              price: product['price'],
              id: product['id'],
              slug: product['slug'],
              weight: product['weight'],
              availableStocks: product['availableStocks'],
            };
            return <ProductCard product={data} key={index} />;
          })}
      </div>
    </div>
  );
}
