import EditProductForm from '@/components/dashboard/products/forms/EditProductForm';
import React from 'react';

type Props = {
  params: {
    id: string;
  };
};

function page({ params: { id } }: Props) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Edit Products
      </div>

      <EditProductForm id={id} />
    </div>
  );
}

export default page;
