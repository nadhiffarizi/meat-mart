import ViewSaleSummaryReportByCategory from '@/components/dashboard/reports/sales/category/ViewSaleSummaryReportByCategory';
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
        View Sale Report
      </div>
      <ViewSaleSummaryReportByCategory storeId={storeId} />
    </div>
  );
}

export default page;
