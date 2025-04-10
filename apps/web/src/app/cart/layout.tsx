import Navbar from '@/components/Navbar';
import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar isFixed={false} />
      {children}
    </>
  );
}
