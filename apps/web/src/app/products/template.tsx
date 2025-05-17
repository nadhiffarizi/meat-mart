import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primaryBackground">
      <Header />
      <div className="pt-0 md:pt-10 lg:pt-24"></div>
      {children}
      <Footer />
    </div>
  );
}
