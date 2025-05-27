'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helper/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { Category } from './columns';

function ViewCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: session, update } = useSession();
  const [search, setSearch] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api(
          `dashboard/category/all?page=${page}&limit=${limit}&q=${search}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setTotalCount(response.data.count);
        setCategories(response.data.categories as Category[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getCategories();
  }, [session?.user.access_token, session, page, search]);

  return (
    <DataTable
      columns={columns}
      data={categories}
      setSearch={setSearch}
      totalCount={totalCount}
      page={page}
      setPage={setPage}
      limit={limit}
    />
  );
}

export default ViewCategories;
