'use client';
import { Card } from '@/components/Card';
import { api } from '@/helper/api';
import { IProduct } from '@/interface/product/product.interface';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    async function getFilteredProducts() {
      try {
        const response = await api(`products/all?q=${query}`, 'GET', {});

        setFilteredProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    getFilteredProducts();
  }, [query]);

  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0">
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold">
          Searching products for &quot;{query}&quot;
        </h3>
        <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3  lg:grid-cols-5  gap-4 md:ml-10 lg:ml-0">
          {filteredProducts.map((card, key) => (
            <Card {...card} stock={0} key={card.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
