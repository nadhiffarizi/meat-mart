import CreateAdminForm from '@/components/dashboard/admin/forms/CreateAdminForm';
import ViewUsers from '@/components/dashboard/admin/ViewUsers';
import Dropdown from '@/components/dashboard/DropDown';
import React from 'react';
import { CornerDownLeft } from 'lucide-react';

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
