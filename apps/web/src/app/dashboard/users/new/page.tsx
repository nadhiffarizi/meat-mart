import CreateAdmin from '@/components/dashboard/admin/CreateAdmin';
import ViewUsers from '@/components/dashboard/admin/ViewUsers';
import Dropdown from '@/components/dashboard/DropDown';
import React from 'react';

function page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Add Employees
      </div>
      <CreateAdmin />
    </div>
  );
}

export default page;
