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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function getStores() {
      try {
        if (status === 'loading') return;

        if (!session?.user?.email) {
          setError('No user email found in session');
          setLoading(false);
          return;
        }

        const data = await getListStore(session.user.email);
        setStores(data);
      } catch (error: any) {
        console.error('Error fetching stores:', error);
        setError(error.message || 'Failed to fetch stores');
      } finally {
        setLoading(false);
      }
    }

    getStores();
  }, [session, status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <DataTable columns={columns} data={stores} />;
}

export default ViewStores;
