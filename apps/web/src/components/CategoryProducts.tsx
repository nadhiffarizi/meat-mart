'use client';
import { useState, useEffect } from 'react';
import { meatCategories } from '@/data/categories';
import Link from 'next/link';
import { Card } from './Card';

interface CategoryProductsProps {
  categorySlug: string;
  subcategorySlug: string;
}

const mockProducts = [
  {
    id: '1',
    name: 'Premium Beef',
    price: 120000,
    category: 'Beef',
    stock: 17,
    popularity: 95,
    isNew: true,
    isSpecial: false,
  },
];

export default function CategoryProducts({
  categorySlug,
  subcategorySlug,
}: CategoryProductsProps) {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const category = meatCategories.find((cat) => cat.slug === categorySlug);

  const subcategories = [
    {
      id: '1',
      name: 'Termurah',
      slug: 'termurah',
      sortFn: (a: any, b: any) => a.price - b.price,
    },
    {
      id: '2',
      name: 'Terpopuler',
      slug: 'terpopuler',
      sortFn: (a: any, b: any) => b.popularity - a.popularity,
    },
    {
      id: '3',
      name: 'Terbaru',
      slug: 'terbaru',
      sortFn: (a: any, b: any) => (a.isNew ? -1 : 1),
    },
    {
      id: '4',
      name: 'Special',
      slug: 'special',
      filterFn: (product: any) => product.isSpecial,
    },
  ];

  const categoryName =
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
  console.log(categoryName);
  useEffect(() => {
    // Filter products by category
    let products = mockProducts.filter(
      (product) => product.category === categoryName,
    );

    // Apply subcategory filter
    const currentSub = subcategories.find(
      (sub) => sub.slug === subcategorySlug,
    );
    if (currentSub) {
      if (currentSub.sortFn) products = products.sort(currentSub.sortFn);
      if (currentSub.filterFn) products = products.filter(currentSub.filterFn);
    }

    setFilteredProducts(products);
    console.log(categoryName, subcategorySlug, filteredProducts);
  }, [categorySlug, subcategorySlug]);

  if (!category) return <div>Category not found</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-lg shadow p-4 sticky top-4">
          <h2 className="text-lg font-bold mb-4">Filter</h2>
          <nav>
            <ul className="space-y-2">
              {subcategories.map((subcat) => (
                <li key={subcat.id}>
                  <Link
                    href={`/categories/${categorySlug}/${subcat.slug}`}
                    className={`block px-3 py-2 rounded transition ${
                      subcategorySlug === subcat.slug
                        ? 'bg-primaryGreen text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {subcat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      <main className="flex-1">
        <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((card, index) => (
            // <Card {...card} key={key} />
            <div key={index}>hello</div>
          ))}
        </div>
      </main>
    </div>
  );
}
