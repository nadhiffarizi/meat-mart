'use client';

import React, { useState } from 'react';
import meatMart from '@/media/image/meat-mart-large.jpeg';
import Image from 'next/image';
import {
  UserRoundPen,
  CircleUser,
  PackageSearch,
  TicketPercent,
  FileChartColumn,
  X,
  Menu,
  LogOut,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { name: 'User Management', href: '/dashboard/users', icon: <UserRoundPen /> },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: <PackageSearch />,
  },
  {
    name: 'Discounts',
    href: '/dashboard/discounts',
    icon: <TicketPercent />,
  },
  { name: 'Report', href: '/dashboard/reports', icon: <FileChartColumn /> },
  { name: 'My Profile', href: '/dashboard/profile', icon: <CircleUser /> },
];

function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="z-10 bg-blue-500">
      {/* hamburger */}
      <button
        className="md:hidden p-2 bg-green-200 ml-6 mt-7"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Menu className="text-red-400" />
      </button>

      {/* sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full flex flex-col justify-between p-4 bg-green-200 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-end md:hidden bg-blue-400">
            <button onClick={() => setIsOpen(false)}>
              <X />
            </button>
          </div>

          <Image
            src={meatMart}
            width={500}
            height={500}
            className="object-cover"
            alt="Meat Mart Logo"
          ></Image>

          <nav className="space-y-4">
            {navItems.map((item) => {
              let isActive = false;
              if (pathname === item.href) isActive = true;

              return (
                <Link
                  href={item.href}
                  key={item.name}
                  className="bg-blue-200 flex items-center gap-2 w-full py-2 px-4 rounded-2xl"
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-white' : 'text-gray-200'}`}
                  >
                    {item.icon}
                  </span>

                  <span className="">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <button className="bg-red-200 flex justify-center items-center gap-2 w-full py-2 px-4 rounded-2xl">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
