import EditDiscountForm from '@/components/dashboard/discounts/forms/EditDiscountForm';
import EditProductForm from '@/components/dashboard/products/forms/EditProductForm';
import EditStockForm from '@/components/dashboard/stocks/forms/EditStocksForm';
import React from 'react';

type Props = {
  params: {
    storeId: string;
    discountId: string;
  };
};

function page({ params: { storeId, discountId } }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">Edit Stocks</div>

      <EditDiscountForm storeId={storeId} discountId={discountId} />
    </div>
  );
}

export default page;
