/** @format */
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import InitialState from '@/components/hoc/initialState.component';

type Props = {
  children: React.ReactNode;
};

export default function Template({ children }: Props) {
  return (
    <>
      <SessionProvider>
        <InitialState>
          <Header />
          <div className="pt-0 md:pt-24"></div>
          {children}
          <Footer />
        </InitialState>
      </SessionProvider>
    </>
  );
}
