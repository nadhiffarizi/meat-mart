'use client';
import React, { useEffect, useState } from 'react';
import Dropdown from '../DropDown';
import { IGetUsers } from '@/app/interfaces/user.interface';
import { api } from '@/helpers/api';
import { DataTable } from '../DataTable';
import { columns, User } from './columns';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

function ViewUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const dummyUsers: User[] = [
    {
      id: '1',
      email: 'zlice@email.com',
      role: 'SUPER_ADMIN',
    },
    {
      id: '2',
      email: 'alice@email.com',
      role: 'ADMIN',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
    {
      id: '1',
      email: 'alice@email.com',
      role: 'CUSTOMER',
    },
  ];

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await api(`admin/users`, 'GET');
        const simplifiedUsers: User[] = response.data.map(
          (user: IGetUsers) => ({
            id: user.id,
            email: user.email,
            role: user.role,
          }),
        );

        setUsers(simplifiedUsers);
      } catch (error) {}
    }
    getUsers();
  }, []);

  return (
    // <Dropdown buttonLabel="View all Users">
    //   <DataTable columns={columns} data={dummyUsers} />
    // </Dropdown>

    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger className="bg-red-200">
          View All Users
        </AccordionTrigger>
        <AccordionContent>
          <DataTable columns={columns} data={dummyUsers} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default ViewUsers;
