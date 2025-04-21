import Categories from '@/components/CategoryMenu';
import CategoryMenu from '@/components/CategoryMenu';
import { meatCategories } from '@/data/categories';
import Link from 'next/link';

import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = meatCategories.find((cat) => cat.slug === params.slug);

  if (!category) {
    return notFound();
  }

  const subcategories = [
    { id: '1', name: 'Premium', slug: 'premium-cuts' },
    { id: '2', name: 'Organik', slug: 'organic-options' },
    { id: '3', name: 'Frozen', slug: 'value-packs' },
    { id: '4', name: 'Kampung Fresh', slug: 'specialty-items' },
  ];

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
                  {subcategories.map((subcat) => (
                    <li key={subcat.id}>
                      <Link
                        href={`/categories/${category.slug}/${subcat.slug}`}
                        className="block px-3 py-2 rounded hover:bg-gray-100 transition"
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
            <div className="bg-white rounded-lg shadow p-6">
              <p> Temukan produk {category.name} disini.</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
