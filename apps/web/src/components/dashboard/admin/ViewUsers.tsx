'use client';
import React, { useEffect, useState } from 'react';
import Dropdown from '../DropDown';
import { api } from '@/helper/api';
import { DataTable } from './DataTable';
import { columns, User } from './columns';
import { Toaster, toast } from 'sonner';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useSession } from 'next-auth/react';
import { IGetUsers } from '@/interface/user/user.interface';

function ViewUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session, update, status } = useSession();

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await api(
          `admin/users/all`,
          'GET',
          {},
          session?.user.access_token,
        );

        const simplifiedUsers: User[] = response.data.map(
          (user: IGetUsers) => ({
            id: user.id,
            email: user.email,
            role: user.role,
          }),
        );

        setUsers(simplifiedUsers);
      } catch (error: any) {
        console.log(error);
      }
    }
    getUsers();
  }, [session?.user.access_token, session]);

  return (
    // <Dropdown buttonLabel="View all Users">
    //   <DataTable columns={columns} data={dummyUsers} />
    // </Dropdown>

    // <Accordion type="single" collapsible>
    //   <AccordionItem value="item-1">
    //     <AccordionTrigger className="bg-red-200">
    //       View All Users
    //     </AccordionTrigger>
    //     <AccordionContent>
    //       <DataTable columns={columns} data={dummyUsers} />
    //     </AccordionContent>
    //   </AccordionItem>
    // </Accordion>

    <>
      <DataTable columns={columns} data={users} />
    </>
  );
}

export default ViewUsers;
