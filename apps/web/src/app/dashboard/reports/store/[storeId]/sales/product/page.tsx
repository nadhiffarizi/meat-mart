import ViewSaleSummaryReportByProduct from '@/components/dashboard/reports/sales/product/ViewSaleSummaryReportByProduct';
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
      <ViewSaleSummaryReportByProduct storeId={storeId} />
    </div>
  );
}

export default page;
