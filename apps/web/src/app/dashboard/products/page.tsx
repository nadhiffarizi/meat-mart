import ViewCategories from '@/components/dashboard/categories/ViewCategories';
import React from 'react';

function page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Manage Products
      </div>
      <div>
        <div>Manage Categories</div>
        <ViewCategories />
      </div>
    </div>
  );
}

export default page;
