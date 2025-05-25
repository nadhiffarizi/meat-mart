import { ReactNode } from 'react';
import SlidingCategories from '@/components/CategoryMenu';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primaryBackground">
      <Header />
      <div className="pt-0 md:pt-24">
        <SlidingCategories />
      </div>
      <div>{children}</div>

      <Footer />
    </div>
  );
}
