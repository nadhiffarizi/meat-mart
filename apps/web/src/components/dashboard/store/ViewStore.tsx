'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helper/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { getListStore } from '@/helper/store/store.helper';
import IStore from '@/interface/store/store.interface';

function ViewStores() {
  const [stores, setStores] = useState<IStore[]>([]);
  const { data: session, update, status } = useSession();

  useEffect(() => {
    async function getStores() {
      try {
        const data = await getListStore(session?.user.email);
        setStores(data);
      } catch (error: any) {
        console.log(error);
      }
    }
    getStores();
  }, [session?.user.email, session]);

  return <DataTable columns={columns} data={stores} />;
}

export default ViewStores;
