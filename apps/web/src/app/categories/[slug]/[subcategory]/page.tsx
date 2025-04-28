'use client';
import { usePathname } from 'next/navigation';
import CategoryProducts from '@/components/CategoryProducts';

interface SubcategoryPageProps {
  params: {
    slug: string;
    subcategory: string;
  };
}

export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const pathname = usePathname();
  const currentSubSlug = pathname.split('/')[3];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CategoryProducts
        categorySlug={params.slug}
        subcategorySlug={currentSubSlug}
      />
    </div>
  );
}
