import { notFound } from 'next/navigation';
import { meatCategories } from '@/data/categories';

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

  return null;
}
