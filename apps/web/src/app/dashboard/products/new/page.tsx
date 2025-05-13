import React from 'react';
import CreateProductForm from '@/components/dashboard/products/forms/CreateProductForm';

function page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Add Products
      </div>
      <CreateProductForm />
    </div>
  );
}

export default page;
