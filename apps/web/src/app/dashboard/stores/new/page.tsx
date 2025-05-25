import React from 'react';
import CreateProductForm from '@/components/dashboard/products/forms/CreateProductForm';
import CreateStoreForm from '@/components/dashboard/store/forms/CreateStoreForm';

function page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">Add Store</div>
      <CreateStoreForm />
    </div>
  );
}

export default page;
