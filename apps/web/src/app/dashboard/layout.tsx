import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import Sidebar from '@/components/dashboard/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meat Mart',
  description: 'meat mart official web market',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center w-full min-h-screen bg-white">
      <div className="flex w-full max-w-[1440px] min-w-[320px]">
        {/* <Sidebar />
            <main className="flex-1 py-8 px-10 bg-white">{children}</main> */}
        <SidebarProvider>
          <Suspense>
            <AppSidebar />
            <main className="flex flex-col flex-1 bg-white">
              <SidebarTrigger />
              <div className="py-8 px-10  bg-white">{children}</div>
            </main>
          </Suspense>
        </SidebarProvider>
      </div>
    </div>
  );
}
