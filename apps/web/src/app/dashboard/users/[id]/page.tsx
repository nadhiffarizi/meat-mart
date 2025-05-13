import CreateAdmin from '@/components/dashboard/admin/CreateAdmin';
import EditAdminForm from '@/components/dashboard/admin/forms/EditAdminForm';
import ViewAdminForm from '@/components/dashboard/admin/forms/ViewAdminForm';
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
        View Employees
      </div>

      <ViewAdminForm id={id} />
    </div>
  );
}

export default page;
