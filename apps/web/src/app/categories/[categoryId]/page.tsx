'use client';
import { Card } from '@/components/Card';
import Categories from '@/components/CategoryMenu';
import CategoryMenu from '@/components/CategoryMenu';
import { meatCategories } from '@/data/categories';
import { api } from '@/helper/api';
import { IGetCategories } from '@/interface/product/category.interface';
import {
  IGetDashboardProducts,
  IProduct,
} from '@/interface/product/product.interface';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({
  params: { categoryId },
}: CategoryPageProps) {
  const [allProducts, setAllProducts] = useState<IProduct[]>([]);
  const [allCategories, setAllCategories] = useState<IGetCategories[]>([]);

  useEffect(() => {
    async function getAllCategories() {
      try {
        const response = await api(`category/all`, 'GET', {});
        setAllCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllCategories();
  }, []);

  useEffect(() => {
    async function getAllProducts() {
      try {
        const response = await api(
          `products/category/${categoryId}`,
          'GET',
          {},
        );
        setAllProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getAllProducts();
  }, [categoryId]);

  const currentCategory = allCategories.find(
    (category) => category.id === categoryId,
  );

  return (
    <div className="bg-primaryBackground min-h-screen">
      <Categories />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h2 className="text-lg font-bold mb-4"></h2>
              <nav>
                <ul className="space-y-2">
                  {allCategories.map((category) => (
                    <li key={category.id}>
                      <Link
                        href={`/categories/${category.id}`}
                        className="block px-3 py-2 rounded hover:bg-gray-100 transition"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <main className="flex gap-2 flex-col flex-1">
            <h1 className="text-3xl font-bold mb-6">{currentCategory?.name}</h1>
            <div>
              {allProducts.map((product) => {
                return allProducts.map((card, key) => (
                  <Card product={card} key={card.id} />
                ));
              })}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p> Temukan produk {currentCategory?.name} disini.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
