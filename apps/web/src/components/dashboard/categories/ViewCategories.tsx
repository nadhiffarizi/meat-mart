'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helper/handlers/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { Category } from './columns';

function ViewCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: session, update } = useSession();

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await api(
          `category/all`,
          'GET',
          {},
          session?.user.access_token,
        );
        setCategories(response.data as Category[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getCategories();
  }, [session?.user.access_token, session]);

  return <DataTable columns={columns} data={categories} />;
}

export default ViewCategories;
