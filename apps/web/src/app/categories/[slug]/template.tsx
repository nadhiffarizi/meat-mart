import { ReactNode } from 'react';
import SlidingCategories from '@/components/CategoryMenu';

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primaryBackground">
      <div className="pt-0 md:pt-10 lg:pt-24">
        <SlidingCategories />
      </div>

      {children}
    </div>
  );
}
