import ViewStockSummaryReport from '@/components/dashboard/reports/stocks/overview/ViewStockSummaryReport';
import React from 'react';

type Props = {
  params: {
    storeId: string;
  };
};

function page({ params: { storeId } }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        View Stock Report
      </div>
      <ViewStockSummaryReport storeId={storeId} />
    </div>
  );
}

export default page;
