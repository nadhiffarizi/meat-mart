'use client';
import {
  Calendar,
  CircleUser,
  CreditCard,
  FileChartColumn,
  Forklift,
  Home,
  Inbox,
  Package,
  PackageSearch,
  Search,
  Settings,
  StoreIcon,
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
import meatMartDashboard from '@/media/image/meat-mart-dashboard.png';
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
  { title: 'User Management', url: '/dashboard/users', icon: UserRoundPen },
  { title: 'Stores', url: '/dashboard/stores', icon: StoreIcon },
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
  {
    title: 'Transactions',
    url: '/dashboard/transaction-list',
    icon: CreditCard,
  },
  { title: 'Orders', url: '/dashboard/order-list', icon: Package },
  { title: 'My Profile', url: '/dashboard/profile', icon: CircleUser },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, update, status } = useSession();
  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between py-4 px-5">
        <div className="flex flex-col gap-2">
          <Link href={'/dashboard'}>
            <Image
              src={meatMartDashboard}
              width={500}
              height={500}
              className="object-cover"
              alt="Meat Mart Logo"
            ></Image>
          </Link>

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
                        : `bg-[#F5F5F5] hover:bg-white flex items-center gap-2 w-full py-2 px-4 rounded-2xl`
                      : `bg-[#F5F5F5] hover:bg-white flex items-center gap-2 w-full py-2 px-4 rounded-2xl`
                  }
                >
                  <span
                    className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-primaryGreen' : 'text-secondaryText'}`}
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
          className="bg-[#F5F5F5] hover:bg-white py-2 px-4 rounded-2xl"
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
