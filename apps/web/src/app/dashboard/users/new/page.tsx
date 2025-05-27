import CreateAdminForm from '@/components/dashboard/admin/forms/CreateAdminForm';
import React from 'react';

function page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Add Employees
      </div>

      <CreateAdminForm />
    </div>
  );
}

export default page;
