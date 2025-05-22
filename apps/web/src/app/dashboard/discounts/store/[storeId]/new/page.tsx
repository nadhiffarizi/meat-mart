import React from 'react';
import CreateDiscountForm from '@/components/dashboard/discounts/forms/CreateDiscountForm';

type Props = {
  params: {
    storeId: string;
  };
};

function page({ params: { storeId } }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Add Discounts
      </div>

      <CreateDiscountForm storeId={storeId} />
    </div>
  );
}

export default page;
