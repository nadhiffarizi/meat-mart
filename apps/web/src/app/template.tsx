/** @format */
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

type Props = {
  children: React.ReactNode;
};

export default function Template({ children }: Props) {
  return (
    <>
      <SessionProvider>
        {/* <Header /> */}
        {children}
        {/* <Footer /> */}
      </SessionProvider>
    </>
  );
}
