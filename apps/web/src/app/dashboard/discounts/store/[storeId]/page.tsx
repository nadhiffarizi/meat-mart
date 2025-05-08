import ViewDiscounts from '@/components/dashboard/discounts/ViewDiscounts';
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
        Manage Discounts
      </div>
      <ViewDiscounts storeId={storeId} />
    </div>
  );
}

export default page;
