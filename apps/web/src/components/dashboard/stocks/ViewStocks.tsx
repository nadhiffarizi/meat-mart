'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helper/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { Stock } from './columns';

function ViewStocks({ storeId }: { storeId: string }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { data: session, update, status } = useSession();
  const [search, setSearch] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>();
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    async function getStocks() {
      try {
        const response = await api(
          `stock/all?storeId=${storeId}&page=${page}&limit=${limit}&q=${search}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setTotalCount(response.data.count);
        setStocks(response.data.stocks as Stock[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getStocks();
  }, [session?.user.access_token, session, storeId, page, search]);

  return (
    <DataTable
      columns={columns}
      data={stocks}
      setSearch={setSearch}
      totalCount={totalCount}
      page={page}
      setPage={setPage}
      limit={limit}
    />
  );
}

export default ViewStocks;
