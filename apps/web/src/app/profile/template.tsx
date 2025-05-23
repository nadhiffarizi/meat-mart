import React from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

type Props = {
  children: React.ReactNode;
};

export default function template({ children }: Props) {
  return (
    <div>
      <Header />{' '}
      <div className="flex items-center justify-center">
        <div className="flex justify-center w-full p-4 ">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
