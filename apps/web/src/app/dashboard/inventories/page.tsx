'use client';
import { IGetStores } from '@/app/interfaces/store.interface';
import { LocationCard } from '@/components/dashboard/inventories/LocationCard';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/helpers/api';
import { ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

function Page() {
  const [allStores, setAllStores] = useState<IGetStores[]>();
  const { data: session, update } = useSession();

  useEffect(() => {
    async function getAllStores() {
      try {
        const response = await api(
          `store/all`,
          'GET',
          {},
          session?.user.access_token,
        );
        setAllStores(response.data as IGetStores[]);
      } catch (error: any) {
        console.log(error);
      }
    }
    getAllStores();
  }, [session?.user.access_token]);

  return (
    <div className="flex flex-col gap-8">
      <div className="text-primaryText text-3xl font-semibold">
        Select Store
      </div>
      <Input />
      <div className="flex gap-4 flex-wrap">
        {allStores?.length ? (
          allStores.map((store) => {
            return (
              <LocationCard
                name=" njkbhbh"
                address="kjbhxdb"
                store_id={store.id}
                key={store.id}
              />
            );
          })
        ) : (
          <Link href={'/dashboard'}>
            <Card className="flex flex-col justify-between w-[200px] md:w-[350px] break-words ">
              <CardHeader>
                <CardTitle>Create your first store.</CardTitle>
                <CardDescription className="">
                  You do not have a store yet. Create your first store to unlock
                  this feature.
                </CardDescription>
              </CardHeader>
              <CardFooter className="w-full flex md:justify-end">
                {' '}
                <ChevronRight />
              </CardFooter>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}

export default Page;
