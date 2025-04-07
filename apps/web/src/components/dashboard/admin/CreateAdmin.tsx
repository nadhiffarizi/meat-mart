'use client';
import Dropdown from '@/components/dashboard/DropDown';
import React from 'react';
import CreateAdminForm from './forms/CreateAdminForm';

function CreateAdmin() {
  return (
    <Dropdown buttonLabel="Add a New Employee">
      <div className="flex justify-center items-center w-full">
        <div className="w-full max-w-screen-md flex flex-col gap-2">
          <p className="mt-1 text-secondaryOrange font-semibold">{`Their Details`}</p>

          <CreateAdminForm />
        </div>
      </div>
    </Dropdown>
  );
}

export default CreateAdmin;
