'use client';
import Dropdown from '@/components/dashboard/DropDown';
import React from 'react';
import CreateAdminForm from './forms/CreateAdminForm';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function CreateAdmin() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-red-200">
          Add a New Employee
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex justify-center items-center w-full">
            <div className="w-full max-w-screen-md flex flex-col gap-2">
              <p className="mt-1 text-secondaryOrange font-semibold">{`Their Details`}</p>
              <CreateAdminForm />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default CreateAdmin;
