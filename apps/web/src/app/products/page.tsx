'use client';
import { Card } from '@/components/Card';
import { PaginationComponent } from '@/components/Pagination';
import { api } from '@/helper/api';
import { getProducts } from '@/helper/product/product.helper';
import { IProduct } from '@/interface/product/product.interface';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [productData, setProductData] = useState<IProduct[]>();
  const [totalCount, setTotalCount] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const limit = 2;

  useEffect(() => {
    const resProduct = getProducts(
      `products?q=${query}&limit=${limit}&page=${page}`,
    );

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

        async function getTotalCount() {
          const response = await api(`products/count?q=${query}`, 'GET', {});
          console.log('Raw total from API:', response.data);
          setTotalCount(response.data);
        }
        getTotalCount();
      });
  }, [query, page, limit]);

  console.log('Rendering component with page:', page);

  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0">
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold">
          Searching products for &quot;{query}&quot;
        </h3>
        <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3  lg:grid-cols-5  gap-4 md:ml-10 lg:ml-0">
          {productData?.length ? (
            productData.map((product) => (
              <Card product={product} key={product.id} />
            ))
          ) : (
            <div>Try another keyword.</div>
          )}
        </div>

        {totalCount && (
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalCount={totalCount}
            itemsPerPage={2}
          />
        )}
      </div>
    </div>
  );
}

export default Page;
