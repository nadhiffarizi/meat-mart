'use client';
import { Card } from '@/components/Card';
import { PaginationComponent } from '@/components/Pagination';
import { api } from '@/helper/api';
import { getProducts } from '@/helper/product/product.helper';
import { IProduct } from '@/interface/product/product.interface';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CardSkeletonList from '@/components/skeleton/card.skeleton';

function Page() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [productData, setProductData] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const limit = 5;

  useEffect(() => {
    setIsLoading(true);

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
        setProductData([...a]);

        async function getTotalCount() {
          const response = await api(`products/count?q=${query}`, 'GET', {});
          setTotalCount(response.data);
        }
        return getTotalCount();
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, page, limit]);

  return (
    <div className="max-w7-xl lg:w-[70%] m-auto px-4 md:px-6 lg:px-0 -mt-96 md:-mt-80 md:mb-44">
      <div className="py-4">
        <h3 className="text-xl md:text-3xl font-bold">
          Searching products for &quot;{query}&quot;
        </h3>

        {isLoading ? (
          <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3 lg:grid-cols-5 gap-4 md:ml-10 lg:ml-0 md:mb-36">
            <CardSkeletonList />
          </div>
        ) : (
          <>
            <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3 lg:grid-cols-5 gap-4 md:ml-10 lg:ml-0">
              {productData.length > 0 ? (
                productData.map((product) => (
                  <Card product={product} key={product.id} />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  No products found. Try another keyword.
                </div>
              )}
            </div>

            {totalCount > 0 && (
              <PaginationComponent
                page={page}
                setPage={setPage}
                totalCount={totalCount}
                itemsPerPage={limit}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
