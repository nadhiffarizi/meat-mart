'use client';
import {
  Calendar,
  CircleUser,
  FileChartColumn,
  Forklift,
  Home,
  Inbox,
  PackageSearch,
  Search,
  Settings,
  TicketPercent,
  UserRoundPen,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import meatMart from '@/media/image/meat-mart-large.jpeg';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

// Menu items.
const items = [
  {
    title: 'User Management',
    url: '/dashboard/users',
    icon: UserRoundPen,
    hideTo: 'ADMIN',
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: PackageSearch,
  },
  {
    title: 'Inventory',
    url: '/dashboard/inventories',
    icon: Forklift,
  },
  {
    title: 'Discounts',
    url: '/dashboard/discounts',
    icon: TicketPercent,
    hideTo: 'SUPER_ADMIN',
  },
  { title: 'Report', url: '/dashboard/reports', icon: FileChartColumn },
  { title: 'My Profile', url: '/dashboard/profile', icon: CircleUser },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, update, status } = useSession();
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between py-4 px-5">
        <div className="flex flex-col gap-2">
          <Image
            src={meatMart}
            width={500}
            height={500}
            className="object-cover"
            alt="Meat Mart Logo"
          ></Image>

          <nav className="space-y-4">
            {items.map((item) => {
              let isActive = false;
              if (pathname.includes(item.url)) isActive = true;

              return (
                <Link
                  href={item.url}
                  key={item.url}
                  className={
                    item.hideTo
                      ? item.hideTo === session?.user.role
                        ? `hidden`
                        : `bg-blue-200 flex items-center gap-2 w-full py-2 px-4 rounded-2xl`
                      : `bg-blue-200 flex items-center gap-2 w-full py-2 px-4 rounded-2xl`
                  }
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-white' : 'text-gray-200'}`}
                  >
                    {<item.icon />}
                  </span>

                  <span className="">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          className="bg-slate-500 py-2 px-4 rounded-2xl"
          onClick={() => {
            signOut({
              redirectTo: '/',
            });
          }}
        >
          Log Out
        </button>
      </SidebarContent>
    </Sidebar>
  );
}
