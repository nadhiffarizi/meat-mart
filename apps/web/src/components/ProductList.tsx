'use client';
import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { ICard } from '@/interface/product/card.interface';
import { IGetDashboardProducts } from '@/interface/product/product.interface';
import { api } from '@/helper/api';
import { useSession } from 'next-auth/react';

export const ProductList = () => {
  const [allProducts, setAllProducts] = useState<IGetDashboardProducts[]>([]);
  useEffect(() => {
    async function getAllProducts() {
      try {
        const response = await api(`products/all?limit=6`, 'GET', {});
        setAllProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllProducts();
  }, []);

  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0">
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold">Daging Yang Kamu Mau!</h3>
        <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3  lg:grid-cols-5  gap-4 md:ml-10 lg:ml-0">
          {allProducts.map((card, key) => (
            <Card {...card} stock={0} key={key} />
          ))}
        </div>
      </div>
    </div>
  );
};
