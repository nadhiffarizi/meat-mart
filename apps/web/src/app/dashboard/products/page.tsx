'use client';
import ViewCategories from '@/components/dashboard/categories/ViewCategories';
import ViewProducts from '@/components/dashboard/products/ViewProducts';
import { Alert } from '@/components/ui/alert';
import { PenOff } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

function Page() {
  const { data: session, update } = useSession();
  return (
    <div className="flex flex-col gap-8">
      {session?.user.role == 'ADMIN' && (
        <Alert variant={'affirmative'}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <div className="text-lg font-semibold">Read Only</div>
              <div className="text-sm">
                Click{' '}
                <Link href={'/dashboard'} className="underline">
                  here to return to dashboard.
                </Link>
              </div>
            </div>
            <PenOff className="w-8 h-8" />
          </div>
        </Alert>
      )}
      <div className="text-primaryText text-3xl font-semibold">
        Manage Products
      </div>
      <div>
        <div>Manage Categories</div>
        <ViewCategories />
      </div>
      <div>
        <div>Manage Products</div>
        <ViewProducts />
      </div>
    </div>
  );
}

export default Page;
