'use client';
import React, { useEffect, useState } from 'react';
import Dropdown from '../DropDown';
import { IGetUsers } from '@/app/interfaces/user.interface';
import { api } from '@/helpers/api';
import { DataTable } from '../DataTable';
import { columns, User } from './columns';

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
    <Dropdown buttonLabel="View all Users">
      <DataTable columns={columns} data={dummyUsers} />
    </Dropdown>
  );
}

export default ViewUsers;
