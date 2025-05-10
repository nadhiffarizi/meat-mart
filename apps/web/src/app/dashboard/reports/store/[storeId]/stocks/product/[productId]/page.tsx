'use client';
import ViewStockHistoryReport from '@/components/dashboard/reports/stocks/history/ViewStockHistoryReport';
import { useSearchParams } from 'next/navigation';
import React from 'react';

type Props = {
  params: {
    productId: string;
    storeId: string;
  };
};

function Page({ params: { productId, storeId } }: Props) {
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        View Stock History
      </div>
      <ViewStockHistoryReport productId={productId} storeId={storeId} />
    </div>
  );
}

export default Page;
