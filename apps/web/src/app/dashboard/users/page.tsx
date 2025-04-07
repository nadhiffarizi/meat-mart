import CreateAdmin from '@/components/dashboard/admin/CreateAdmin';
import Dropdown from '@/components/dashboard/DropDown';
import React from 'react';

function page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Manage Employees
      </div>
      <CreateAdmin />
      <Dropdown buttonLabel="View all Users">lorem50</Dropdown>
    </div>
  );
}

export default page;
