'use client';
import { usePathname } from 'next/navigation';
import CategoryProducts from '@/components/CategoryProducts';
import { useEffect, useState } from 'react';
import { IGetCategories } from '@/interface/product/category.interface';
import { api } from '@/helper/api';
import { useSession } from 'next-auth/react';

interface Props {
  params: {
    categoryId: string;
  };
}

export default function SubcategoryPage({ params }: Props) {
  const [categoryData, setCategoryData] = useState<IGetCategories>();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function getCategoryData() {
      try {
        const response = await api(
          `category?id=${params.categoryId}`,
          'GET',
          {},
        );
        setCategoryData(response.data as IGetCategories);
      } catch (error) {
        console.log(error);
      }
    }
    if (session?.user.id) {
      getCategoryData();
    } else getCategoryData();
  }, [params.categoryId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-96">
      {categoryData && <CategoryProducts categoryData={categoryData} />}
    </div>
  );
}
