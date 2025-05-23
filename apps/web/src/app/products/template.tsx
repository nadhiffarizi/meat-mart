import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-primaryBackground">
      <Header />
      <div className="min-h-96"></div>
      {children}
      <Footer />
    </div>
  );
}
