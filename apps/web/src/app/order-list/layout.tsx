import Navbar from '@/components/Navbar';
import * as React from 'react';
import { ToastContainer } from 'react-toastify';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar isFixed={false} />
      <ToastContainer autoClose={2000} closeOnClick />
      {children}
    </>
  );
}
