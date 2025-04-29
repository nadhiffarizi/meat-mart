import React from 'react';
import { Card } from './Card';
import { ICard } from '@/interfaces/card.interface';
import { getProducts } from '@/helper/product.helper';
import IProduct from '@/interface/product.interface';

export const ProductList = async () => {
  // call get products
  const resProducts = await getProducts('products');
  const data = (await resProducts.json())['data'];
  const productData: IProduct[] = data.map((product: any) => {
    const data: IProduct = {
      name: product['name'],
      price: product['price'],
      id: product['id'],
      slug: product['slug'],
      weight: product['weight'],
      availableStocks: product['Stocks'],
    };
    return data;
  });
  // console.log('data', productData.at(0)?.availableStocks.length);

  const productList: ICard[] = [
    {
      id: 1,
      name: 'Ayam Kampung Jantan',
      price: 70000,
      stock: 5,
    },
    { id: 2, name: 'Ikan Nila', price: 70000, stock: 5 },
    { id: 3, name: 'Daging Wagyu Slice', price: 150000, stock: 5 },
    { id: 4, name: 'Udang Kupas', price: 70000, stock: 5 },
    { id: 5, name: 'Hati Ayam', price: 70000, stock: 0 },
  ];
  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0">
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold">Daging Yang Kamu Mau!</h3>
        <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3  lg:grid-cols-5  gap-4 md:ml-10 lg:ml-0">
          {productData.map((product, key) => (
            <Card product={product} key={key} />
          ))}
        </div>
      </div>
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold ">Promo Menarik</h3>
        <div className="m-auto my-5  grid grid-cols-2 text-xs md:text-sm md:grid-cols-3  lg:grid-cols-5 gap-4 md:ml-10 lg:ml-0">
          {productData.map((product, key) => (
            <Card product={product} key={key} />
          ))}
        </div>
      </div>
    </div>
  );
};
