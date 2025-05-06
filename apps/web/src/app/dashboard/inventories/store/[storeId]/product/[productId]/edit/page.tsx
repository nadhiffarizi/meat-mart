import EditProductForm from '@/components/dashboard/products/forms/EditProductForm';
import EditStockForm from '@/components/dashboard/stocks/forms/EditStocksForm';
import React from 'react';

type Props = {
  params: {
    storeId: string;
    productId: string;
  };
};

function page({ params: { storeId, productId } }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">Edit Stocks</div>

      <EditStockForm storeId={storeId} productId={productId} />
    </div>
  );
}

export default page;
