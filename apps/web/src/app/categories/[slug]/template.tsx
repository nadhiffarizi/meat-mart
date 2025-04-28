import { ReactNode } from 'react';
import SlidingCategories from '@/components/CategoryMenu';

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primaryBackground min-h-screen">
      <SlidingCategories />
      {children}
    </div>
  );
}
