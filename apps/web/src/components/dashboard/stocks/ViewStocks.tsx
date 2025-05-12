'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helper/handlers/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { Stock } from './columns';

function ViewStocks({ storeId }: { storeId: string }) {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const { data: session, update, status } = useSession();

  useEffect(() => {
    async function getStocks() {
      try {
        const response = await api(
          `stock/all?storeId=${storeId}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setStocks(response.data as Stock[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getStocks();
  }, [session?.user.access_token, session, storeId]);

  return <DataTable columns={columns} data={stocks} />;
}

export default ViewStocks;
