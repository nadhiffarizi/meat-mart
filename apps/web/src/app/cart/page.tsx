import NavBar from '@/components/Navbar/Navbar.component';
import * as React from 'react';

export default function CartPage() {
  return (
    <div>
      <NavBar />
      <div className=" flex justify-center items-center w-full h-screen ">
        <div className="w-1/2 min-w-[500px] h-4/5 min-h-[500px] bg-slate-50 rounded-sm shadow-lg ring-2"></div>
      </div>
    </div>
  );
}
