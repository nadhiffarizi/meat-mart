'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helper/api';
import { DataTable } from './DataTable';
import { columns, User } from './columns';
import { useSession } from 'next-auth/react';
import { IGetUsers } from '@/interface/user/user.interface';

function ViewUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session, update, status } = useSession();
  const [search, setSearch] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await api(
          `admin/users/all?page=${page}&limit=${limit}&q=${search}`,
          'GET',
          {},
          session?.user.access_token,
        );

        setTotalCount(response.data.count);

        const simplifiedUsers: User[] = response.data.users.map(
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
  }, [session?.user.access_token, session, page, search]);

  return (
    <>
      <DataTable
        columns={columns}
        data={users}
        setSearch={setSearch}
        totalCount={totalCount}
        page={page}
        setPage={setPage}
        limit={limit}
      />
    </>
  );
}

export default ViewUsers;
