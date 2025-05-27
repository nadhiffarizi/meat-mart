'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helper/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { Discount } from './columns';

function ViewDiscounts({ storeId }: { storeId: string }) {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const { data: session, update, status } = useSession();
  const [search, setSearch] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    async function getDiscounts() {
      try {
        const response = await api(
          `dashboard/discount/all?storeId=${storeId}&page=${page}&limit=${limit}&q=${search}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setTotalCount(response.data.count);
        setDiscounts(response.data.discounts as Discount[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getDiscounts();
  }, [session?.user.access_token, session, storeId, page, search]);

  return (
    <DataTable
      columns={columns}
      data={discounts}
      storeId={storeId}
      setSearch={setSearch}
      totalCount={totalCount}
      page={page}
      setPage={setPage}
      limit={limit}
    />
  );
}

export default ViewDiscounts;
