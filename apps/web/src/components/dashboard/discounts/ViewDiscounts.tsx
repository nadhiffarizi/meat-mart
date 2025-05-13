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

  useEffect(() => {
    async function getDiscounts() {
      try {
        const response = await api(
          `dashboard/discount/all?storeId=${storeId}`,
          'GET',
          {},
          session?.user.access_token,
        );
        setDiscounts(response.data as Discount[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getDiscounts();
  }, [session?.user.access_token, session, storeId]);

  return <DataTable columns={columns} data={discounts} storeId={storeId} />;
}

export default ViewDiscounts;
