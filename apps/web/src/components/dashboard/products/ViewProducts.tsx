'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/helpers/api';
import { DataTable } from './DataTable';
import { columns } from './columns';
import { useSession } from 'next-auth/react';
import { Product } from './columns';

function ViewProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const { data: session, update, status } = useSession();

  useEffect(() => {
    async function getProducts() {
      try {
        const response = await api(
          `dashboard/product/all`,
          'GET',
          {},
          session?.user.access_token,
        );
        setProducts(response.data as Product[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getProducts();
  }, [session?.user.access_token, session]);

  return <DataTable columns={columns} data={products} />;
}

export default ViewProducts;
