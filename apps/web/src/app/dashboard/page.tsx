'use client';
import { ReportTypeCard } from '@/components/dashboard/reports/ReportTypeCard';
import { useSession } from 'next-auth/react';
import React from 'react';

function Page() {
  const { data: session, update } = useSession();
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Hello {session?.user.email}, what would you like to do?
      </div>
      <div className="flex gap-4 flex-wrap">
        {session?.user.role === 'SUPER_ADMIN' && (
          <div className="flex gap-4 flex-wrap">
            <ReportTypeCard
              title="user management"
              link={`/dashboard/users`}
              description="Manage your users."
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap">
          <ReportTypeCard
            title="products"
            link={`/dashboard/products`}
            description="Manage your products."
          />
        </div>
        <div className="flex gap-4 flex-wrap">
          <ReportTypeCard
            title="inventories"
            link={`/dashboard/inventories`}
            description="Manage your inventories."
          />
        </div>
        {session?.user.role === 'ADMIN' && (
          <div className="flex gap-4 flex-wrap">
            <ReportTypeCard
              title="Discounts"
              link={`/dashboard/discounts`}
              description="Manage your discounts."
            />
          </div>
        )}
        <div className="flex gap-4 flex-wrap">
          <ReportTypeCard
            title="report"
            link={`/dashboard/reports`}
            description="View your sale and stock reports."
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
