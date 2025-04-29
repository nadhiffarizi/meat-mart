import CreateAdmin from '@/components/dashboard/admin/CreateAdmin';
import EditAdminForm from '@/components/dashboard/admin/forms/EditAdminForm';
import EditCategoryForm from '@/components/dashboard/categories/forms/EditCategoryForm';
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
        Edit Categories
      </div>

      <EditCategoryForm id={id} />
    </div>
  );
}

export default page;
