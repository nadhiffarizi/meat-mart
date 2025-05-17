'use client';
import { useState, useEffect } from 'react';
import { meatCategories } from '@/data/categories';
import Link from 'next/link';
import { Card } from './Card';
import { IProduct } from '@/interface/product/product.interface';
import { api } from '@/helper/api';
import { IGetCategories } from '@/interface/product/category.interface';
import { PaginationComponent } from './Pagination';

interface CategoryProductsProps {
  categoryData: IGetCategories;
}

export default function CategoryProducts({
  categoryData,
}: CategoryProductsProps) {
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>();
  const [totalCount, setTotalCount] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const limit = 5;

  useEffect(() => {
    async function getFilteredProducts() {
      try {
        const response = await api(
          `products?categoryId=${categoryData.id}&limit=${limit}&page=${page}`,
          'GET',
          {},
        );
        setFilteredProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getFilteredProducts();

    async function getTotalCount() {
      const response = await api(
        `products/count?categoryId=${categoryData.id}`,
        'GET',
        {},
      );
      setTotalCount(response.data);
    }
    getTotalCount();
  }, [categoryData, page]);

  if (!filteredProducts) return <div>No products in this category found.</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-6">{categoryData.name}</h1>
        <div className="m-auto my-5 grid grid-cols-2 md:text-sm md:grid-cols-3  lg:grid-cols-5  gap-4 md:ml-10 lg:ml-0">
          {filteredProducts?.map((product) => (
            <Card product={product} key={product.id} />
          ))}
        </div>
        {totalCount && (
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalCount={totalCount}
            itemsPerPage={limit}
          />
        )}
      </main>
    </div>
  );
}
