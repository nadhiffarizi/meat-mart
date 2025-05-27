'use client';
import { ReportTypeCard } from '@/components/dashboard/reports/ReportTypeCard';
import React from 'react';

type Props = {
  params: {
    storeId: string;
  };
};

function Page({ params: { storeId } }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Select Report
      </div>
      <div className="flex gap-4 flex-wrap">
        <ReportTypeCard
          title="sales"
          link={`/dashboard/reports/store/${storeId}/sales`}
          description="View your monthly revenue."
        />
      </div>
      <div className="flex gap-4 flex-wrap">
        <ReportTypeCard
          title="stocks"
          link={`/dashboard/reports/store/${storeId}/stocks`}
          description="Track your stock changes."
        />
      </div>
    </div>
  );
}

export default Page;
