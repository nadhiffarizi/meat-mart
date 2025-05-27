'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helper/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { Product } from './columns';

function ViewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { data: session, update, status } = useSession();
  const [search, setSearch] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await api(
          `dashboard/product/all?page=${page}&limit=${limit}&q=${search}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setTotalCount(response.data.count);
        setProducts(response.data.products as Product[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getProducts();
  }, [session?.user.access_token, session, page, search]);

  return (
    <DataTable
      columns={columns}
      data={products}
      setSearch={setSearch}
      totalCount={totalCount}
      page={page}
      setPage={setPage}
      limit={limit}
    />
  );
}

export default ViewProducts;
