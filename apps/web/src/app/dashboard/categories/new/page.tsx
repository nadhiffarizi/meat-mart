import React from 'react';
import CreateCategoryForm from '@/components/dashboard/products/forms/category/CreateCategoryForm';

function page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Add Categories
      </div>

      <CreateCategoryForm />
    </div>
  );
}

export default page;
