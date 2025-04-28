import React from 'react';
import { Card } from './Card';
import { ICard } from '@/interfaces/card.interface';

export const ProductList = () => {
  const productList: ICard[] = [
    {
      id: '1',
      name: 'Ayam Kampung Jantan',
      price: 70000,
      stock: 5,
      category: 'Chicken',
      popularity: 95,
      isNew: true,
      isSpecial: true,
    },
    {
      id: '2',
      name: 'Ikan Nila',
      price: 70000,
      stock: 5,
      category: 'Chicken',
      popularity: 95,
      isNew: true,
      isSpecial: true,
    },
    {
      id: '3',
      name: 'Daging Wagyu Slice',
      price: 150000,
      stock: 5,
      category: 'Chicken',
      popularity: 95,
      isNew: true,
      isSpecial: true,
    },
    {
      id: '4',
      name: 'Udang Kupas',
      price: 70000,
      stock: 5,
      category: 'Chicken',
      popularity: 95,
      isNew: true,
      isSpecial: true,
    },
    {
      id: '5',
      name: 'Hati Ayam',
      price: 70000,
      stock: 0,
      category: 'Chicken',
      popularity: 95,
      isNew: true,
      isSpecial: true,
    },
  ];
  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0">
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold">Daging Yang Kamu Mau!</h3>
        <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3  lg:grid-cols-5  gap-4 md:ml-10 lg:ml-0">
          {productList.map((card, key) => (
            <Card {...card} key={key} />
          ))}
        </div>
      </div>
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold ">Promo Menarik</h3>
        <div className="m-auto my-5  grid grid-cols-2 text-xs md:text-sm md:grid-cols-3  lg:grid-cols-5 gap-4 md:ml-10 lg:ml-0">
          {productList.map((card, key) => (
            <Card {...card} key={key} />
          ))}
        </div>
      </div>
    </div>
  );
};
